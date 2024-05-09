import type { CollectionConfig } from 'payload/types';
import checkSection from '../lib/checkSection';

const Fanmerch: CollectionConfig = {
	slug: 'fanmerch',
	labels: {
		singular: 'Fanmerch',
		plural: 'Fanmerch',
	},
	admin: {
		useAsTitle: 'name',
		defaultColumns: ['name', 'price', 'quantity', 'category'],
		hidden: (req) => !checkSection(req, 'dokomi-fan-booth'),
	},
	access: {
		read: () => true,
		create: ({ req }) => checkSection(req, 'dokomi-fan-booth'),
		update: ({ req }) => checkSection(req, 'dokomi-fan-booth'),
		delete: ({ req }) => checkSection(req, 'dokomi-fan-booth'),
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
		},
		{
			name: 'description',
			type: 'textarea',
			required: false,
			maxLength: 500,
		},
		{
			name: 'image',
			type: 'relationship',
			relationTo: 'media',
			required: false,
		},
		{
			name: 'price',
			type: 'number',
			required: false,
			min: 0,
		},
		{
			name: 'quantity',
			type: 'number',
			required: false,
			defaultValue: 0,
			min: 0,
		},
		{
			name: 'category',
			type: 'select',
			options: ['button', 'postcard', 'keychain', 'sticker', 'other'],
			required: true,
		},
		{
			name: 'model',
			type: 'text',
			admin: {
				description: 'An URL to the 3D model file',
			},
		},
		{
			name: 'project',
			type: 'relationship',
			relationTo: 'projects',
		},
	],
};

export default Fanmerch;
