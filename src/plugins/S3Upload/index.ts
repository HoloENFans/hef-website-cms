import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Config as PayloadConfig } from 'payload/config';
import path from 'path';
import { S3IncomingUploadType, S3UploadConfig } from '../../types/S3Upload';
import fileExists from './lib/fileExists';
import getSanitizedName from './lib/getSanitizedName';

export default (config: S3UploadConfig) => {
	const client = new S3Client({
		credentials: config.credentials,
		region: config.region,
		endpoint: config.endpoint,
	});

	return (incomingConfig: PayloadConfig) => {
		const { collections: incomingCollections } = incomingConfig;
		const collections = incomingCollections.map((collection) => {
			if (!collection.upload || collection.upload === true) {
				return collection;
			}

			const beforeChangeCollectionHooks = collection.hooks?.beforeChange ?? [];
			const afterDeleteCollectionHooks = collection.hooks?.afterDelete ?? [];
			const afterReadCollectionHooks = collection.hooks?.afterRead ?? [];
			const { s3 } = collection.upload as S3IncomingUploadType;

			// Ensure that the filename is safe
			// eslint-disable-next-line max-len
			beforeChangeCollectionHooks.push(async ({ data, req }) => {
				const { file } = req.files;

				// Figure out what filename the file should get
				const filename: string = await fileExists(req.payload, collection.slug, data.filename)
					? await getSanitizedName(req.payload, collection.slug, file.name)
					: data.filename;

				// Replace the filename in the data
				const oldBasename = path.basename(data.filename, path.extname(data.filename));
				const newBasename = path.basename(filename, path.extname(filename));

				// eslint-disable-next-line no-param-reassign
				data.filename = data.filename.replace(oldBasename, newBasename);
				if (data.sizes) {
					Object.values(data.sizes).forEach((resizedFileData: Partial<any>) => {
						// eslint-disable-next-line no-param-reassign
						resizedFileData.filename = resizedFileData.filename.replace(oldBasename, newBasename);
					});
				}

				return data;
			});

			// Upload hook
			beforeChangeCollectionHooks.push(async ({ data, req }) => {
				// Check some config
				if (!s3.bucket && !config.bucket) throw new Error('No bucket specified');

				const { file: reqFile } = req.files;

				// Generate a list of files
				const files = [{
					filename: data.filename,
					mimeType: data.mimeType,
					buffer: reqFile.data,
				}];

				if (data.sizes) {
					Object.entries(data.sizes).forEach(([key, resizedFileData]: [string, Partial<any>]) => {
						files.push({
							filename: resizedFileData.filename,
							mimeType: data.mimeType,
							buffer: req.payloadUploadSizes[key],
						});
					});
				}

				const tasks = files.map(async (file) => {
					let key = file.filename;
					if (s3.prefix) {
						key = s3.prefix instanceof Function
							? path.posix.join(s3.prefix(data), key)
							: path.posix.join(s3.prefix, key);
					}

					await client.send(new PutObjectCommand({
						Bucket: s3.bucket ?? config.bucket,
						Key: key,
						Body: file.buffer,
						...s3.commandInput,
					}));
				});
				await Promise.all(tasks);
			});

			afterDeleteCollectionHooks.push(async ({ doc }) => {
				const files = [{
					filename: doc.filename,
				}];

				if (doc.sizes) {
					Object.values(doc.sizes).forEach((fileData: Partial<any>) => {
						files.push({
							filename: fileData.filename,
						});
					});
				}

				const tasks = files.map(async (file) => {
					let key = file.filename;
					if (s3.prefix) {
						key = s3.prefix instanceof Function
							? path.posix.join(s3.prefix(doc), key)
							: path.posix.join(s3.prefix, key);
					}

					await client.send(new DeleteObjectCommand({
						Bucket: s3.bucket ?? config.bucket,
						Key: key,
					}));
				});
				await Promise.all(tasks);
			});

			afterReadCollectionHooks.push(async ({ doc }) => {
				const endpointUrl = await client.config.endpoint();
				const publicUrl = config.publicUrl ?? `${endpointUrl.protocol}//${s3.bucket ?? config.bucket}.${endpointUrl.hostname}${endpointUrl.path === '/' ? '' : endpointUrl.path}`;

				// eslint-disable-next-line no-param-reassign
				doc.url = `${publicUrl}/${s3.prefix}/${doc.filename}`;

				Object.keys(doc.sizes).forEach((key) => {
					// eslint-disable-next-line no-param-reassign
					doc.sizes[key] = `${publicUrl}/${s3.prefix}/${doc.sizes[key].filename}`;
				});
			});

			// Remove the S3 key for typechecking
			const { s3: _, ...clonedUpload } = collection.upload as S3IncomingUploadType;
			return {
				...collection,
				upload: {
					...clonedUpload,
				},
				hooks: {
					...collection.hooks,
					beforeChange: beforeChangeCollectionHooks,
					afterDelete: afterDeleteCollectionHooks,
					afterRead: afterReadCollectionHooks,
				},
			};
		});

		return {
			...incomingConfig,
			collections,
		};
	};
};
