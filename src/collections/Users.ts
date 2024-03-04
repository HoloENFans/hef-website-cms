import { CollectionConfig } from 'payload/types';
import checkRole from '../lib/checkRole';

const Users: CollectionConfig = {
	slug: 'users',
	auth: {
		useAPIKey: true,
		verify: true,
	},
	admin: {
		useAsTitle: 'name',
		defaultColumns: ['name', 'email', 'group'],
	},
	labels: {
		singular: 'User',
		plural: 'Users',
	},
	access: {
		read: ({ req, id }) => req.user?.id === id || checkRole(req, 'superadmin'),
		create: ({ req }) => checkRole(req, 'superadmin'),
		update: ({ req, id }) => req.user?.id === id || checkRole(req, 'superadmin'),
		delete: ({ req }) => checkRole(req, 'superadmin'),
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			label: 'Name',
			required: true,
			saveToJWT: true,
		},
		{
			name: 'roles',
			type: 'select',
			label: 'Roles',
			defaultValue: 'project-owner',
			required: true,
			hasMany: true,
			options: [
				{
					label: 'Superadmin',
					value: 'superadmin',
				},
				{
					label: 'Project owner',
					value: 'project-owner',
				},
				{
					label: 'Content moderator',
					value: 'content-moderator',
				},
				{
					label: 'Developer',
					value: 'developer',
				},
				{
					label: 'Translator',
					value: 'translator',
				},
			],
			saveToJWT: true,
		},
	],
};

export default Users;
