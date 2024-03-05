import { CollectionConfig } from 'payload/types';
import { relationship } from 'payload/dist/fields/validations';
// eslint-disable-next-line import/extensions
import FormBuilder from '../components/tripetto/FormBuilder';
import checkRole from '../lib/checkRole';

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
	access: {
		read: ({ req }) => {
			if (req.user) return true;

			return {
				status: {
					equals: 'open',
				},
			};
		},
		create: ({ req }) => checkRole(req, 'project-owner'),
		update: ({ req }) => checkRole(req, 'project-owner'),
		delete: ({ req }) => checkRole(req, 'superadmin'),
	},
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
			name: 'isSubmissionForm',
			label: 'Submission form',
			type: 'radio',
			options: [
				{
					value: 'true',
					label: 'Yes',
				},
				{
					value: 'false',
					label: 'No',
				},
			],
			admin: {
				description: 'If this is a submission form, it should follow the guide in Discord.',
			},
			required: true,
		},
		{
			name: 'project',
			type: 'relationship',
			relationTo: 'projects',
			validate: (val, args) => {
				if (args.siblingData.isSubmissionForm === 'true' && !val) {
					return 'Project cannot be empty if form is a submission form';
				}

				return relationship(val, args);
			},
		},
		{
			name: 'status',
			type: 'select',
			options: [
				{
					value: 'open',
					label: 'Open',
				},
				{
					value: 'closed',
					label: 'Closed',
				},
			],
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
