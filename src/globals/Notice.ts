import { GlobalConfig } from 'payload/types';
import checkRole from '../lib/checkRole';

const Notice: GlobalConfig = {
	slug: 'notice',
	label: 'Notice banner',
	access: {
		read: () => true,
		update: ({ req }) => checkRole(req, 'developer'),
	},
	fields: [
		{
			type: 'checkbox',
			name: 'enabled',
		},
		{
			type: 'text',
			name: 'description',
			validate: (val, { data }) => {
				if (data.enabled === true && val?.length === 0) return 'Description cannot be empty';
				return true;
			},
		},
		{
			type: 'richText',
			name: 'message',
		},
	],
};

export default Notice;
