import { CollectionConfig } from 'payload/types';
import checkRole from '../lib/checkRole';

const Media: CollectionConfig = {
	slug: 'media',
	admin: {
		disableDuplicate: true,
		description: 'Website media',
		hidden: (req) => !checkRole(req, 'superadmin'),
	},
	access: {
		read: () => true,
		create: ({ req }) => checkRole(req, 'project-owner'),
		update: ({ req }) => checkRole(req, 'superadmin'),
		delete: ({ req }) => checkRole(req, 'superadmin'),
	},
	upload: {
		staticDir: '../storage/media',
		mimeTypes: ['image/*'],
	},
	fields: [],
};

export default Media;
