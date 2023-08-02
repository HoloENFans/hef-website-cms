import { CollectionConfig } from 'payload/types';
import FormBuilder from '../components/tripetto/FormBuilder.tsx';

const Forms: CollectionConfig = {
	slug: 'forms',
	admin: {
		useAsTitle: 'name',
		description: 'Submission forms',
		defaultColumns: ['name'],
	},
	labels: {
		singular: 'Form',
		plural: 'Forms',
	},
	access: {},
	hooks: {},
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
			name: 'form',
			type: 'json',
			admin: {
				components: {
					Field: FormBuilder,
				},
			},
			required: true,
		},
	],
};

export default Forms;
