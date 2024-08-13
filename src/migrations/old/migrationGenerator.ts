import 'dotenv/config';
import payload from 'payload';
import { Options } from 'payload/dist/collections/operations/local/findByID';
import path from 'path';
import type { PaginatedDocs } from 'payload/database';

// eslint-disable-next-line max-len
export default async function runMigrationFunction<O = any, R = O>(collectionSlug: string, migrationFn: (doc: O) => Promise<Partial<R>>, dry = false, overrideFindOptions: Partial<Options<any>> = {}) {
	process.env.PAYLOAD_CONFIG_PATH = path.resolve(__dirname, '../../payload.config.ts');

	await payload.init({
		secret: process.env.PAYLOAD_SECRET,
		// @ts-ignore
		mongoURL: process.env.MONGODB_URI,
		local: true,
	});

	// @ts-ignore
	const results: PaginatedDocs<O> = await payload.find({
		collection: collectionSlug as any,
		depth: 0,
		limit: 20000,
		...overrideFindOptions,
	});

	try {
		await Promise.all(results.docs.map(async (result) => {
			// @ts-ignore
			const { id } = result;

			if (collectionSlug) {
				try {
					const dataChange = await migrationFn(result);
					if (dry) {
						console.log(`Running dry, would be updating '${id}' with:`, dataChange);
					} else {
						console.log(`Updating ${id}...`);
						await payload.update({
							collection: collectionSlug as any,
							id,
							data: dataChange,
						});
					}

					console.log(`Document in '${collectionSlug}' with id '${id}' updated successfully`);
				} catch (e) {
					/* For whatever reason throws errors while actually successful */
					console.log(e);
				}
			} else {
				console.log(`No document found in '${collectionSlug}' with id '${id}'`);
			}
		}));
	} catch (e) {
		console.error('Something went wrong...');
		payload.logger.error('Something went wrong.');
		payload.logger.error(e);
	}

	console.log('Complete');
}
