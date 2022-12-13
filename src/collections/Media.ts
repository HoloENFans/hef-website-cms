import { CollectionConfig } from 'payload/types';
import checkRole from '../lib/checkRole';

const Media: CollectionConfig = {
	slug: 'media',
	admin: {
		disableDuplicate: true,
		description: 'Website media',
	},
	access: {
		read: () => true,
		create: ({ req }) => checkRole(req, 'project-owner'),
		update: () => false,
		delete: ({ req }) => checkRole(req, 'project-owner'),
	},
	upload: {
		staticDir: '../storage/media',
		imageSizes: [
			{
				name: 'icon',
				width: 200,
				height: null,
				crop: 'center',
			},
			{
				name: 'opengraph',
				width: null,
				height: 630,
				crop: 'center',
			},
			{
				name: 'thumbnail',
				width: 1024,
				height: null,
				crop: 'center',
			},
		],
		adminThumbnail: 'icon',
		mimeTypes: ['image/*'],
	},
	fields: [],
};

export default Media;
