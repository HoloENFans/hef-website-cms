import { CollectionConfig } from 'payload/types';
import checkGroup from '../middleware/checkGroup';

const Users: CollectionConfig = {
	slug: 'users',
	auth: true,
	admin: {
		useAsTitle: 'name',
	},
	access: {
		read: (req) => checkGroup(req, 'superadmin'),
		create: (req) => checkGroup(req, 'superadmin'),
		update: (req) => checkGroup(req, 'superadmin'),
		delete: (req) => checkGroup(req, 'superadmin'),
	},
	fields: [
		// Email added by default
		// Add more fields as needed
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
					label: 'Translator',
					value: 'translator',
				},
			],
			saveToJWT: true,
		},
	],
};

export default Users;
