import express from 'express';
import { nanoid } from 'nanoid';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

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

router.post('/upload', async (req, res) => {
	const { fileExt } = req.body;
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
	const command = new DeleteObjectCommand({
		Bucket: process.env.S3_BUCKET,
		Key: `form-submissions/tmp/${req.body.key}`,
	});

	await s3.send(command);

	res.status(204).end();
});

export default router;
