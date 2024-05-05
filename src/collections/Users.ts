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
		hidden: (req) => !checkRole(req, 'superadmin'),
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
			name: 'sections',
			type: 'select',
			label: 'Sections',
			defaultValue: 'hefw',
			required: true,
			hasMany: true,
			options: [
				{
					label: 'HoloEN Fan Website',
					value: 'hefw',
				},
				{
					label: 'Timelinerys',
					value: 'timelinerys',
				},
				{
					label: 'DoKomi fan-booth',
					value: 'dokomi-fan-booth',
				},
			],
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
				{
					label: 'Misc',
					value: 'misc',
				},
			],
			saveToJWT: true,
		},
	],
};

export default Users;
