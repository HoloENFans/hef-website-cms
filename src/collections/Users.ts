import { CollectionConfig } from 'payload/types';
import checkGroup from '../middleware/checkGroup';

const Users: CollectionConfig = {
	slug: 'users',
	auth: true,
	admin: {
		useAsTitle: 'name',
		defaultColumns: ['name', 'email', 'group'],
	},
	access: {
		read: (req) => checkGroup(req, 'superadmin'),
		create: (req) => checkGroup(req, 'superadmin'),
		update: (req) => checkGroup(req, 'superadmin'),
		delete: (req) => checkGroup(req, 'superadmin'),
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
			name: 'group',
			type: 'select',
			label: 'Group',
			defaultValue: 'admin',
			required: true,
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
