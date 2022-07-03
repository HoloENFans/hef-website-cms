import { CollectionConfig } from 'payload/types';

const Submissions: CollectionConfig = {
	slug: 'submissions',
	admin: {
		useAsTitle: 'author',
		description: 'Submissions for projects',
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
