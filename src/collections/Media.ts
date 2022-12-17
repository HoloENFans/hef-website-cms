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
		mimeTypes: ['image/*'],
	},
	fields: [],
};

export default Media;
