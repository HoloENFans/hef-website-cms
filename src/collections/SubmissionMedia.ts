import { CollectionConfig } from 'payload/types';
import checkRole from '../lib/checkRole';

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
		staticDir: '../storage/submissions',
		mimeTypes: ['image/*'],
	},
	fields: [],
};

export default Media;
