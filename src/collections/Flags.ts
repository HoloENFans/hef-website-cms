import { CollectionConfig } from 'payload/types';
import checkRole from '../lib/checkRole';

const Flags: CollectionConfig = {
	slug: 'flags',
	admin: {
		useAsTitle: 'name',
		defaultColumns: ['name', 'code'],
	},
	access: {
		read: () => true,
		create: (req) => checkRole(req, 'developer'),
		update: (req) => checkRole(req, 'developer'),
		delete: (req) => checkRole(req, 'developer'),
	},
	fields: [
		{
			name: 'code',
			type: 'text',
			required: true,
			admin: {
				description: 'Flag name as in the code',
			},
		},
		{
			name: 'name',
			type: 'text',
			required: true,
			admin: {
				description: 'Flag name in the dashboard',
			},
		},
	],
};

export default Flags;
