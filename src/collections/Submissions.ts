import { CollectionConfig } from 'payload/types';
import { PayloadRequest } from 'payload/dist/express/types';
import checkRole from '../middleware/checkRole';
import {
	Guild, Project, Submission, SubmissionMedia,
} from '../payload-types';

const Submissions: CollectionConfig = {
	slug: 'submissions',
	admin: {
		useAsTitle: 'author',
		description: 'Submissions for projects',
		defaultColumns: ['author', '_status', 'project', 'id'],
	},
	access: {
		read: ({ req }) => {
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
		create: (req) => checkRole(req, 'project-owner'),
		update: (req) => checkRole(req, ['project-owner', 'content-moderator']),
		delete: async (req) => {
			if (checkRole(req, 'superadmin')) return true;
			if (!checkRole(req, ['project-owner', 'content-moderator'])) return false;

			const { req: { user, payload }, id }: { req: PayloadRequest, id: string } = req;
			if (!id) return true;
			const submission = await payload.findByID<Submission>({
				collection: 'submissions',
				id,
				depth: 2,
			});
			const staffList = ((submission.project as Project).organizer as Guild).staff;
			return staffList?.includes(user.id);
		},
	},
	versions: {
		drafts: {
			autosave: true,
		},
	},
	labels: {
		singular: 'Submission',
		plural: 'Submissions',
	},
	hooks: {
		afterDelete: [
			async ({ req, doc }: { req: PayloadRequest, doc: Submission }) => {
				if (doc.type === 'image' && doc.media) {
					await req.payload.delete({
						collection: 'submission-media',
						id: (doc.media as SubmissionMedia | undefined)?.id ?? doc.media as string,
						overrideAccess: true,
					});
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
			name: 'type',
			type: 'select',
			required: true,
			defaultValue: 'text',
			options: [
				{
					label: 'Text',
					value: 'text',
				},
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
			name: 'message',
			type: 'textarea',
		},
		{
			name: 'media',
			type: 'upload',
			relationTo: 'submission-media',
			admin: {
				condition: (data) => data.type === 'image',
			},
		},
		{
			name: 'url',
			type: 'text',
			admin: {
				condition: (data) => data.type === 'video',
				description: 'URL to the video to display',
			},
		},
	],
};

export default Submissions;
