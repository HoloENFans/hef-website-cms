import type { CollectionConfig } from 'payload/types';

const Events: CollectionConfig = {
	slug: 'events',
	labels: {
		singular: 'Event',
		plural: 'Events',
	},
	access: {
		read: () => true,
	},
	fields: [
		{
			name: 'project',
			type: 'relationship',
			relationTo: 'projects',
			required: true,
			index: true,
		},
		{
			name: 'date',
			type: 'date',
			required: true,
		},
		{
			name: 'title',
			type: 'text',
			required: true,
		},
		{
			name: 'images',
			type: 'array',
			required: true,
			fields: [
				{
					name: 'image',
					type: 'upload',
					relationTo: 'events-media',
					filterOptions: {
						mimeType: {
							or: [{ equals: 'image/jpeg' }, { equals: 'image/png' }, { equals: 'image/bmp' }]
						},
					},
				},
			],
		},
		{
			name: 'background_image',
			type: 'upload',
			required: false,
			relationTo: 'events-media',
			filterOptions: {
				mimeType: {
					or: [{ equals: 'image/jpeg' }, { equals: 'image/png' }, { equals: 'image/bmp' }]
				},
			},
		},
		{
			name: 'content',
			type: 'richText',
			required: true,
			admin: {
				elements: ['link', 'blockquote', 'ul', 'ol', 'indent'],
				leaves: ['bold', 'italic', 'underline', 'strikethrough'],
			},
		},
	],
};

export default Events;
