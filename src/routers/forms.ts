import express from 'express';
import { nanoid } from 'nanoid';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import cors from 'cors';
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

async function validateTurnstileResponse(turnstileResponse: string): Promise<boolean> {
	const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		body: JSON.stringify({
			secret: process.env.TURNSTILE_SECRET,
			response: turnstileResponse,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
	});

	const data = await res.json();

	return data.success as boolean;
}

router.use(express.json());
router.options('*', cors({
	origin: corsList,
}));
router.use(cors({
	origin: corsList,
}));

router.post('/upload', async (req, res) => {
	const { fileExt, turnstileResponse } = req.body;
	if (!turnstileResponse || typeof turnstileResponse !== 'string' || turnstileResponse.trim().length === 0 || !await validateTurnstileResponse(turnstileResponse)) {
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
		filename,
	});
});

router.delete('/upload', async (req, res) => {
	const { key, turnstileResponse } = req.body;
	if (!turnstileResponse || typeof turnstileResponse !== 'string' || turnstileResponse.trim().length === 0 || !await validateTurnstileResponse(turnstileResponse)) {
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
