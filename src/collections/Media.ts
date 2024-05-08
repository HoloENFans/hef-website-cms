import { CollectionConfig } from 'payload/types';
import checkRole from '../lib/checkRole';

const Media: CollectionConfig = {
	slug: 'media',
	admin: {
		disableDuplicate: true,
		description: 'All media',
	},
	access: {
		read: () => true,
		create: ({ req }) => checkRole(req, ['project-owner', 'developer']),
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
