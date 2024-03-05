import { CollectionConfig } from 'payload/types';
import { PayloadRequest } from 'payload/dist/express/types';
import checkRole from '../lib/checkRole';
import { FormSubmission, SubmissionMedia } from '../payload-types';

const FormSubmissions: CollectionConfig = {
	slug: 'form-submissions',
	admin: {
		defaultColumns: ['id', 'form'],
	},
	access: {
		read: ({ req }) => !!req.user,
		create: ({ req }) => checkRole(req, 'project-owner'),
		update: ({ req }) => checkRole(req, 'project-owner'),
		delete: ({ req }) => checkRole(req, 'superadmin'),
	},
	hooks: {
		afterDelete: [
			async ({ req, doc }: { req: PayloadRequest, doc: FormSubmission }) => {
				// Delete any images connected to this submission
				await Promise.all(doc.media.map(async (media) => {
					if (media.image) {
						await req.payload.delete({
							collection: 'submission-media',
							id: (media.image as SubmissionMedia | undefined)?.id ?? media.image as string,
							overrideAccess: true,
						});
					}
				}));
			},
		],
	},
	labels: {
		singular: 'Form submission',
		plural: 'Form submissions',
	},
	fields: [
		{
			name: 'form',
			type: 'relationship',
			relationTo: 'forms',
			required: true,
			index: true,
		},
		{
			name: 'data',
			type: 'json',
			required: true,
		},
		{
			name: 'media',
			type: 'array',
			fields: [
				{
					name: 'image',
					type: 'upload',
					relationTo: 'submission-media',
				},
			],
		},
	],
};

export default FormSubmissions;
