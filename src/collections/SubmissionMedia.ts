import { CollectionConfig } from 'payload/types';
import checkRole from '@/lib/checkRole';

const Media: CollectionConfig = {
	slug: 'submission-media',
	admin: {
		disableDuplicate: true,
		description: 'Media for project submissions',
		hidden: (req) => !checkRole(req, 'superadmin'),
	},
	labels: {
		singular: 'Submission media',
		plural: 'Submission media',
	},
	access: {
		read: () => true,
		create: ({ req }) => checkRole(req, 'project-owner'),
		update: ({ req }) => checkRole(req, 'superadmin'),
		delete: ({ req }) => checkRole(req, 'superadmin'),
	},
	upload: {
		staticDir: '../storage/submissions',
		mimeTypes: ['image/*'],
	},
	fields: [],
};

export default Media;
