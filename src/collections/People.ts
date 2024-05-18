import { CollectionConfig } from 'payload/types';
import checkRole from '../lib/checkRole';

const People: CollectionConfig = {
	slug: 'people',
	admin: {
		useAsTitle: 'nickname',
		description: 'People who are related to projects',
	},
	labels: {
		singular: 'Person',
		plural: 'People',
	},
	access: {
		read: () => true,
		create: ({ req }) => checkRole(req, ['developer']),
		update: ({ req }) => checkRole(req, ['developer']),
		delete: ({ req }) => checkRole(req, ['superadmin']),
	},
	fields: [
		{
			name: 'nickname',
			label: 'Name',
			type: 'text',
			required: true,
		},
		{
			name: 'role',
			label: 'Role',
			type: 'text',
			required: true,
		},
		{
			name: 'image',
			label: 'Image',
			type: 'relationship',
			relationTo: 'media',
			required: false,
		},
		{
			name: 'links',
			label: 'Links',
			type: 'relationship',
			relationTo: 'links',
			hasMany: true,
			required: false,
		},
	],
};

export default People;
