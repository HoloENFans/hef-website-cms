import { CollectionConfig } from 'payload/types';
import { PayloadRequest } from 'payload/dist/express/types';
import checkRole from '../middleware/checkRole';
import { Guild, Project } from '../payload-types';

async function checkProjectOwner(req: PayloadRequest, id: string): Promise<boolean> {
	const project = await req.payload.findByID<Project>({
		collection: 'projects',
		id,
		depth: 1,
	});

	const staffList = ((project.organizer as Guild).staff ?? [])
		.concat(
			project.collaborators ?? [],
		);

	return staffList?.includes(req.user.id);
}

const Projects: CollectionConfig = {
	slug: 'projects',
	admin: {
		useAsTitle: 'title',
		description: 'Project list',
		defaultColumns: ['title', 'shortDescription', 'status', 'date'],
		preview: (doc) => {
			if (doc?.slug) {
				return `${process.env.PAYLOAD_PUBLIC_WEBSITE_URL}/projects/${doc.slug}`;
			}

			return null;
		},
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
		create: async (req) => {
			if (checkRole(req, 'superadmin')) return true;
			if (!checkRole(req, 'project-owner')) return false;

			const { req: payloadReq, id }: { req: PayloadRequest, id: string } = req;
			if (!id) return true;
			return checkProjectOwner(payloadReq, id);
		},
		update: async (req) => {
			if (checkRole(req, 'superadmin')) return true;
			if (!checkRole(req, 'project-owner')) return false;

			const { req: payloadReq, id }: { req: PayloadRequest, id: string } = req;
			if (!id) return true;
			return checkProjectOwner(payloadReq, id);
		},
		delete: (req) => checkRole(req, 'superadmin'),
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
			access: {
				update: ({ req, data }) => {
					if (checkRole({ req }, 'translator')) return true;
					if (!checkRole({ req }, 'project-owner')) return false;

					return checkProjectOwner(req, data.id);
				},
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
			access: {
				update: ({ req, data }) => {
					if (checkRole({ req }, 'superadmin')) return true;
					if (!checkRole({ req }, 'project-owner')) return false;

					return checkProjectOwner(req, data.id);
				},
			},
			index: true,
		},
		{
			name: 'shortDescription',
			type: 'textarea',
			required: true,
			localized: true,
			label: 'Short description',
			access: {
				update: ({ req, data }) => {
					if (checkRole({ req }, 'translator')) return true;
					if (!checkRole({ req }, 'project-owner')) return false;

					return checkProjectOwner(req, data.id);
				},
			},
		},
		{
			name: 'description',
			type: 'richText',
			required: true,
			localized: true,
			access: {
				update: ({ req, data }) => {
					if (checkRole({ req }, 'translator')) return true;
					if (!checkRole({ req }, 'project-owner')) return false;

					return checkProjectOwner(req, data.id);
				},
			},
		},
		{
			name: 'organizer',
			type: 'relationship',
			relationTo: 'guilds',
			required: true,
			access: {
				update: ({ req, data }) => {
					if (checkRole({ req }, 'superadmin')) return true;
					if (!checkRole({ req }, 'project-owner')) return false;

					return checkProjectOwner(req, data.id);
				},
			},
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
			access: {
				update: ({ req, data }) => {
					if (checkRole({ req }, 'superadmin')) return true;
					if (!checkRole({ req }, 'project-owner')) return false;

					return checkProjectOwner(req, data.id);
				},
			},
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
			access: {
				create: ({ req, data }) => {
					if (checkRole({ req }, 'superadmin')) return true;
					if (!checkRole({ req }, 'project-owner')) return false;

					return checkProjectOwner(req, data.id);
				},
				update: ({ req, data }) => {
					if (checkRole({ req }, 'superadmin')) return true;
					if (!checkRole({ req }, 'project-owner')) return false;

					return checkProjectOwner(req, data.id);
				},
			},
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
			access: {
				create: ({ req, data }) => {
					if (checkRole({ req }, 'superadmin')) return true;
					if (!checkRole({ req }, 'project-owner')) return false;

					return checkProjectOwner(req, data.id);
				},
				update: ({ req, data }) => {
					if (checkRole({ req }, 'superadmin')) return true;
					if (!checkRole({ req }, 'project-owner')) return false;

					return checkProjectOwner(req, data.id);
				},
			},
		},
		{
			name: 'date',
			type: 'date',
			defaultValue: new Date().toISOString(),
			required: true,
			access: {
				update: ({ req, data }) => {
					if (checkRole({ req }, 'superadmin')) return true;
					if (!checkRole({ req }, 'project-owner')) return false;

					return checkProjectOwner(req, data.id);
				},
			},
		},
		{
			name: 'image',
			type: 'upload',
			relationTo: 'media',
			required: true,
			access: {

				update: ({ req, data }) => {
					if (checkRole({ req }, 'superadmin')) return true;
					if (!checkRole({ req }, 'project-owner')) return false;

					return checkProjectOwner(req, data.id);
				},
			},
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
			access: {

				update: ({ req, data }) => {
					if (checkRole({ req }, 'superadmin')) return true;
					if (!checkRole({ req }, 'project-owner')) return false;

					return checkProjectOwner(req, data.id);
				},
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
