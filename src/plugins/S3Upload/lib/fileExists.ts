import { Payload } from 'payload';

// eslint-disable-next-line max-len
export default async function fileExists(payload: Payload, collection: string, filename: string): Promise<boolean> {
	const existingFiles = await payload.find({
		collection,
		limit: 1,
		depth: 1,
		where: { filename: { equals: filename } },
	});

	return existingFiles.totalDocs > 0;
}
