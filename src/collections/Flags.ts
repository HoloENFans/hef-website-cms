import { CollectionConfig } from 'payload/types';
import checkRole from '../middleware/checkRole';

const Flags: CollectionConfig = {
	slug: 'flags',
	admin: {
		useAsTitle: 'name',
		defaultColumns: ['name', 'id'],
	},
	access: {
		read: () => true,
		create: (req) => checkRole(req, 'developer'),
		update: (req) => checkRole(req, 'developer'),
		delete: (req) => checkRole(req, 'developer'),

	},
	fields: [
		{
			name: 'id',
			type: 'text',
			required: true,
		},
		{
			name: 'name',
			type: 'text',
			required: true,
		},
	],
};

export default Flags;
