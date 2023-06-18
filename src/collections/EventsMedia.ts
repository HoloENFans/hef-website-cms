import type { CollectionConfig } from 'payload/types';

const EventMedia: CollectionConfig = {
	slug: 'events-media',
	labels: {
		singular: 'Event Media',
		plural: 'Event Media',
	},
	access: {
		read: () => true,
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
