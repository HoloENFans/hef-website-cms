import { CollectionConfig } from 'payload/types';
import { PayloadRequest } from 'payload/dist/express/types';
import checkRole from '../lib/checkRole';
import {
	Guild, Project, Submission, SubmissionMedia,
} from '../payload-types';
import revalidatePath from '../lib/revalidatePath';

const Submissions: CollectionConfig = {
	slug: 'submissions',
	admin: {
		useAsTitle: 'author',
		description: 'Submissions for projects',
		defaultColumns: ['author', '_status', 'project', 'id'],
	},
	access: {
		read: async ({ req, id }) => {
			// If there is a user logged in,
			// let them retrieve all documents
			if (req.user) return true;

			// If there is no user,
			// restrict the documents that are returned
			// to only those where `_status` is equal to `published`
			return {
				_status: {
					equals: 'published',
				},
			};
		},
		create: ({ req }) => checkRole(req, 'project-owner'),
		update: ({ req }) => checkRole(req, ['project-owner', 'content-moderator']),
		delete: async ({ req, id }) => {
			if (checkRole(req, 'superadmin')) return true;
			if (!checkRole(req, ['project-owner', 'content-moderator'])) return false;

			if (!id) return true;
			const submission = await req.payload.findByID({
				collection: 'submissions',
				id,
				depth: 2,
			});
			const staffList = ((submission.project as Project).organizer as Guild).staff;
			return staffList?.includes(req.user.id);
		},
	},
	labels: {
		singular: 'Submission',
		plural: 'Submissions',
	},
	hooks: {
		afterDelete: [
			async ({ req, doc }: { req: PayloadRequest, doc: Submission }) => {
				// Delete any images connected to this submission
				await Promise.all(doc.media.map(async (media) => {
					if (media.type === 'image' && media.image) {
						await req.payload.delete({
							collection: 'submission-media',
							id: (media.image as SubmissionMedia | undefined)?.id ?? media.image as string,
							overrideAccess: true,
						});
					}
				}));
			},
		],
		afterChange: [
			async ({ req, doc }) => {
				if (doc.project instanceof String) {
					const project: Project = await req.payload.findByID({
						collection: 'projects',
						id: doc.project,
						depth: 0,
					});
					await revalidatePath(`/projects/${project.slug}`);
				} else {
					await revalidatePath(`/projects/${doc.project.slug}`);
				}
			},
		],
	},
	fields: [
		{
			name: 'project',
			type: 'relationship',
			relationTo: 'projects',
			required: true,
			index: true,
		},
		{
			name: 'author',
			type: 'text',
			required: true,
		},
		{
			name: 'srcIcon',
			label: 'Author profile picture',
			type: 'upload',
			relationTo: 'submission-media',
		},
		{
			name: 'message',
			type: 'textarea',
		},
		{
			name: 'media',
			type: 'array',
			fields: [
				{
					name: 'type',
					type: 'select',
					required: true,
					defaultValue: 'image',
					options: [
						{
							label: 'Image',
							value: 'image',
						},
						{
							label: 'Video',
							value: 'video',
						},
					],
				},
				{
					name: 'subtype',
					type: 'select',
					defaultValue: 'artwork',
					options: [
						{
							label: 'Artwork',
							value: 'artwork',
						},
						{
							label: 'Picture',
							value: 'picture',
						},
						{
							label: 'Other',
							value: 'other',
						},
					],
					admin: {
						condition: (_, siblingData) => siblingData.type === 'image',
					},
				},
				{
					name: 'image',
					type: 'upload',
					relationTo: 'submission-media',
					admin: {
						condition: (_, siblingData) => siblingData.type === 'image',
					},
				},
				{
					name: 'url',
					type: 'text',
					admin: {
						condition: (_, siblingData) => siblingData.type === 'video',
						description: 'URL to the video to display',
					},
				},
			],
		},
		{
			name: 'devprops',
			label: 'Developer properties',
			labels: {
				singular: 'property',
				plural: 'Developer properties',
			},
			type: 'array',
			fields: [
				{
					name: 'key',
					type: 'text',
					required: true,
				},
				{
					name: 'value',
					type: 'code',
					required: true,
					admin: {
						language: 'json',
					},
				},
			],
			access: {
				create: ({ req }) => checkRole(req, 'developer'),
				update: ({ req }) => checkRole(req, 'developer'),
			},
		},
	],
};

export default Submissions;
