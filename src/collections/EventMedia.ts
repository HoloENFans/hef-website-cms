import type { CollectionConfig } from 'payload/types';
import checkRole from '../lib/checkRole';

const EventMedia: CollectionConfig = {
	slug: 'event-media',
	labels: {
		singular: 'Event Media',
		plural: 'Event Media',
	},
	access: {
		read: () => true,
		create: ({ req }) => checkRole(req, 'project-owner'),
		update: ({ req }) => checkRole(req, 'superadmin'),
		delete: ({ req }) => checkRole(req, 'superadmin'),
	},
	upload: {
		staticDir: '../storage/event-media',
		mimeTypes: ['image/*'],
	},
	fields: [
		{
			name: 'alt',
			type: 'text',
			defaultValue: 'This is an image for an event.',
		},
	],
};

export default EventMedia;
