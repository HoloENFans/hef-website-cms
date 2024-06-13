import { CollectionConfig } from 'payload/types';
import checkRole from '../lib/checkRole';

const FormSubmissions: CollectionConfig = {
	slug: 'form-submissions',
	admin: {
		defaultColumns: ['id', 'form', 'status'],
		useAsTitle: 'id',
	},
	access: {
		read: ({ req }) => !!req.user,
		create: ({ req }) => checkRole(req, 'superadmin'),
		update: ({ req }) => checkRole(req, 'superadmin'),
		delete: ({ req }) => checkRole(req, 'superadmin'),
	},
	hooks: {},
	labels: {
		singular: 'Form submission',
		plural: 'Form submissions',
	},
	fields: [
		{
			name: 'form',
			type: 'relationship',
			relationTo: 'forms',
			required: true,
			index: true,
		},
		{
			name: 'data',
			type: 'json',
		},
		{
			name: 'checksum',
			type: 'text',
			hidden: true,
		},
		{
			name: 'status',
			type: 'select',
			options: [
				{
					value: 'pending',
					label: 'Pending',
				},
				{
					value: 'received',
					label: 'Received',
				},
			],
			required: true,
			defaultValue: 'pending',
		},
	],
};

export default FormSubmissions;
