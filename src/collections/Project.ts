import { CollectionConfig } from 'payload/types';
import checkRole from '../middleware/checkRole';

const Projects: CollectionConfig = {
	slug: 'projects',
	admin: {
		useAsTitle: 'title',
		description: 'Project list',
		defaultColumns: ['title', 'shortDescription', 'status', 'date'],
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
	labels: {
		singular: 'Project',
		plural: 'Projects',
	},
	versions: {
		drafts: {
			autosave: true,
		},
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true,
			localized: true,
			admin: {
				description: 'Project title',
			},
		},
		{
			name: 'slug',
			type: 'text',
			required: true,
			admin: {
				description: 'Short name, will be used in url',
			},
			minLength: 4,
			maxLength: 24,
			validate: (value) => {
				const regex = /^([0-z]|-)+$/gi;
				if (!regex.test(value)) {
					return 'String may only contain alphanumeric characters and "-" (/^([0-z]|-)+$/gi)';
				}
				return true;
			},
			index: true,
		},
		{
			name: 'shortDescription',
			type: 'textarea',
			required: true,
			localized: true,
			label: 'Short description',
		},
		{
			name: 'description',
			type: 'richText',
			required: true,
			localized: true,
		},
		{
			name: 'organizer',
			type: 'relationship',
			relationTo: 'guilds',
			required: true,
		},
		{
			name: 'status',
			type: 'select',
			required: true,
			defaultValue: 'ongoing',
			options: [
				{
					label: 'Ongoing',
					value: 'ongoing',
				},
				{
					label: 'Past',
					value: 'past',
				},
			],
		},
		{
			name: 'links',
			type: 'array',
			fields: [
				{
					name: 'name',
					type: 'text',
					required: true,
				},
				{
					name: 'url',
					type: 'text',
					required: true,
				},
			],
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
					name: 'media',
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
			name: 'date',
			type: 'date',
			defaultValue: new Date().toISOString(),
			required: true,
		},
		{
			name: 'image',
			type: 'upload',
			relationTo: 'media',
			required: true,
		},
		{
			name: 'collaborators',
			type: 'relationship',
			relationTo: 'users',
			hasMany: true,
			label: 'Additional collaborators',
			admin: {
				description: 'People added here will have the same permissions as project owners',
			},
		},
		{
			name: 'flags',
			type: 'relationship',
			relationTo: 'flags',
			hasMany: true,
			access: {
				create: (req) => checkRole(req, 'developer'),
				update: (req) => checkRole(req, 'developer'),
			},
		},
	],
};

export default Projects;
