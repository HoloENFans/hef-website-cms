import { CollectionConfig } from 'payload/types';
import checkGroup from '../middleware/checkGroup';
import { S3IncomingUploadType } from '../types/S3Upload';

const Media: CollectionConfig = {
	slug: 'media',
	admin: {
		disableDuplicate: true,
	},
	access: {
		read: () => true,
		create: (req) => checkGroup(req, 'admin') || checkGroup(req, 'superadmin'),
		update: () => false,
		// TODO: Add check for content moderators and if they are assigned to a project
		delete: (req) => checkGroup(req, 'admin') || checkGroup(req, 'superadmin'),
	},
	upload: {
		disableLocalStorage: process.env.NODE_ENV === 'production',
		staticDir: '../storage/media',
		s3: {
			prefix: 'media',
		},
		imageSizes: [
			{
				name: 'icon',
				width: 128,
				height: 128,
				crop: 'center',
			},
		],
		adminThumbnail: 'icon',
	} as S3IncomingUploadType,
	fields: [],
};

export default Media;
