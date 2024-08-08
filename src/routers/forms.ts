import express from 'express';
import { nanoid } from 'nanoid';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { DeleteObjectCommand, CopyObjectCommand, S3Client } from '@aws-sdk/client-s3';
import cors from 'cors';
import payload from 'payload';
import { checksum as calculateChecksum, powVerify, stencil } from '@tripetto/runner';
import { Export } from '@tripetto/runner/lib/data/export';
import rateLimit from 'express-rate-limit';
import corsList from '../lib/corsList';

const router = express.Router();

const s3 = new S3Client({
	endpoint: process.env.S3_ENDPOINT,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY,
		secretAccessKey: process.env.S3_SECRET_KEY,
	},
	forcePathStyle: process.env.S3_PATH_STYLE === 'true',
	region: process.env.S3_REGION,
});

// eslint-disable-next-line max-len
async function validateTurnstileResponse(turnstileResponse: string, clientId?: string): Promise<boolean> {
	const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		body: JSON.stringify({
			secret: process.env.TURNSTILE_SECRET,
			response: turnstileResponse,
			idempotency_key: clientId ?? undefined,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
	});

	const data = await res.json();

	return data.success as boolean;
}

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 100,
});

router.use(limiter);

router.use(express.json());

router.options('*', cors({
	origin: corsList,
}));

router.use(cors({
	origin: corsList,
}));

router.post('/announce', async (req, res) => {
	const { checksum, formId } = req.body;

	if (!checksum || typeof checksum !== 'string' || checksum.trim().length === 0) {
		res.status(400).send('Missing checksum');
		return;
	}

	if (!formId || typeof formId !== 'string' || formId.trim().length === 0) {
		res.status(400).send('Missing form ID');
		return;
	}

	const form = await payload.findByID({
		collection: 'forms',
		id: formId,
	}).catch(() => {
		res.status(400).send('Invalid form Id');
	});

	if (!form) return;

	const newSubmission = await payload.create({
		collection: 'form-submissions',
		data: {
			form: formId,
			checksum,
			status: 'pending',
		},
	});

	res.status(201).json({
		id: newSubmission.id,
		difficulty: 10,
		timestamp: Date.now(),
	});
});

router.post('/submit', async (req, res) => {
	const {
		id, exportables, actionables, turnstileResponse, answer,
	} = req.body;

	if (!id || typeof id !== 'string' || id.trim().length === 0) {
		res.status(400).send('Missing submission ID');
		return;
	}

	if (!exportables || typeof exportables !== 'object') {
		res.status(400).send('Missing submission data');
		return;
	}

	if (actionables && typeof actionables !== 'object') {
		res.status(400).send('Invalid submission data');
		return;
	}

	if (!answer || typeof answer !== 'string' || answer.trim().length === 0) {
		res.status(400).send('Missing answer');
		return;
	}

	if (!turnstileResponse || typeof turnstileResponse !== 'string' || turnstileResponse.trim().length === 0 || !await validateTurnstileResponse(turnstileResponse)) {
		res.status(401).send('Missing or invalid Turnstile response');
		return;
	}

	const submission = await payload.findByID({
		collection: 'form-submissions',
		id,
		depth: 0,
		showHiddenFields: true,
	}).catch(() => {
		res.status(400).send('Invalid submission ID');
	});

	if (!submission) return;

	if (submission.status !== 'pending') {
		res.status(400).send('Submission already received');
		return;
	}

	const form = await payload.findByID({
		collection: 'forms',
		id: submission.form as string,
		showHiddenFields: true,
	}).catch(() => {
		res.status(400).send('Invalid form ID');
	});

	if (!form) {
		res.status(500).end();
		return;
	}

	if (
		stencil('exportables', exportables) !== form.exportablesStencilFingerprint
		|| (actionables && stencil('actionables', actionables) !== form.actionablesStencilFingerprint)
	) {
		res.status(400).send('Invalid body (fingerprint)');
		return;
	}

	if (calculateChecksum({ exportables, actionables }, false) !== submission.checksum) {
		res.status(400).send('Invalid body (checksum)');
		return;
	}

	if (!powVerify(answer, 10, 1000 * 60 * 15, { exportables, actionables }, submission.id)) {
		res.status(400).send('Invalid proof of work');
		return;
	}

	const updatedSubmission = await payload.update({
		collection: 'form-submissions',
		id,
		data: {
			data: {
				exportables,
				actionables,
			},
			status: 'received',
		},
	}).catch(() => {
		res.status(500).end();
	});

	if (!updatedSubmission) return;

	const uploadTypes = ['@tripetto/block-file-upload', '@holoenfans/tripetto-block-multi-file-upload'];
	await Promise.all((exportables as Export.IExportables).fields.map(async (field) => {
		if (uploadTypes.includes(field.type) && field.reference) {
			const filename = field.reference;

			const copyCommand = new CopyObjectCommand({
				Bucket: process.env.S3_BUCKET,
				CopySource: `${process.env.S3_BUCKET}/form-submissions/tmp/${filename}`,
				Key: `form-submissions/${filename}`,
			});

			await s3.send(copyCommand);

			const deleteCommand = new DeleteObjectCommand({
				Bucket: process.env.S3_BUCKET,
				Key: `form-submissions/tmp/${filename}`,
			});
			await s3.send(deleteCommand);
		}
	}));

	res.status(204).end();
});

router.post('/upload', async (req, res) => {
	const { fileExt, turnstileResponse, clientId } = req.body;

	if (!clientId || typeof clientId !== 'string' || clientId.trim().length === 0) {
		res.status(400).send('Missing client ID');
		return;
	}

	if (!turnstileResponse || typeof turnstileResponse !== 'string' || turnstileResponse.trim().length === 0 || !await validateTurnstileResponse(turnstileResponse, clientId)) {
		res.status(401).send('Missing or invalid Turnstile response');
		return;
	}

	if (typeof fileExt !== 'string' || fileExt.trim().length === 0) {
		res.status(400).send('Missing file extension');
		return;
	}

	const filename = `${nanoid(32)}.${fileExt}`;

	const post = await createPresignedPost(s3, {
		Bucket: process.env.S3_BUCKET,
		Key: `form-submissions/tmp/${filename}`,
		Expires: 600,
		Conditions: [
			['content-length-range', 0, 1.049e8],
		],
	});

	res.status(201).json({
		...post,
		url: process.env.S3_PUBLIC_URL ?? post.url,
		filename,
	});
});

router.delete('/upload', async (req, res) => {
	const { key, turnstileResponse, clientId } = req.body;

	if (!clientId || typeof clientId !== 'string' || clientId.trim().length === 0) {
		res.status(400).send('Missing client ID');
		return;
	}

	if (!turnstileResponse || typeof turnstileResponse !== 'string' || turnstileResponse.trim().length === 0 || !await validateTurnstileResponse(turnstileResponse, clientId)) {
		res.status(401).send('Missing or invalid Turnstile response');
		return;
	}

	if (typeof key !== 'string' || key.trim().length === 0) {
		res.status(400).send('Invalid request');
		return;
	}

	const command = new DeleteObjectCommand({
		Bucket: process.env.S3_BUCKET,
		Key: `form-submissions/tmp/${key}`,
	});

	await s3.send(command);

	res.status(204).end();
});

export default router;
