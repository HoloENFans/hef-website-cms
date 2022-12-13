import { CollectionConfig } from 'payload/types';
import checkRole from '../lib/checkRole';
import { S3IncomingUploadType } from '../types/S3Upload';

const Media: CollectionConfig = {
	slug: 'submission-media',
	admin: {
		disableDuplicate: true,
		description: 'Media for project submissions',
	},
	labels: {
		singular: 'Submission media',
		plural: 'Submission media',
	},
	access: {
		read: () => true,
		create: ({ req }) => checkRole(req, 'project-owner'),
		update: () => false,
		delete: () => false,
	},
	upload: {
		disableLocalStorage: process.env.NODE_ENV === 'production',
		staticDir: '../storage/submissions',
		s3: {
			prefix: 'submissions',
		},
		imageSizes: [
			{
				name: 'icon',
				width: 128,
				height: null,
				crop: 'center',
			},
			{
				name: 'thumbnail',
				width: 1024,
				height: null,
				crop: 'center',
			},
			{
				name: 'tanabata',
				width: 400,
				height: 1280,
				crop: 'center',
			},
		],
		adminThumbnail: 'thumbnail',
		mimeTypes: ['image/*'],
	} as S3IncomingUploadType,
	fields: [],
};

export default Media;
