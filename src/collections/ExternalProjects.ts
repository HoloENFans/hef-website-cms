import { CollectionConfig } from 'payload/types';
import checkRole from 'lib/checkRole';

const ExternalProjects: CollectionConfig = {
	slug: 'external-projects',
	admin: {
		useAsTitle: 'name',
		description: 'External projects that are related to the main project.',
	},
	labels: {
		singular: 'External Project',
		plural: 'External Projects',
	},
	access: {
		read: () => true,
		create: ({ req }) => checkRole(req, ['developer']),
		update: ({ req }) => checkRole(req, ['developer']),
		delete: ({ req }) => checkRole(req, ['developer']),
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
			required: true,
		},
		{
			name: 'project',
			type: 'relationship',
			relationTo: 'projects',
			required: true,
			index: true,
		},
		{
			name: 'media',
			type: 'relationship',
			relationTo: 'media',
			hasMany: true,
			required: false,
		},
		{
			name: 'people',
			type: 'relationship',
			relationTo: 'people',
			hasMany: true,
			required: false,
		},
	],
};

export default ExternalProjects;
