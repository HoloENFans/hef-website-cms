import { CollectionConfig } from 'payload/types';
import { PayloadRequest } from 'payload/dist/express/types';
import checkRole from '../lib/checkRole';
import { Guild, Project } from '../payload-types';
import revalidatePath from '../lib/revalidatePath';

// Helper functions
async function checkProjectOwner(req: PayloadRequest, id: string): Promise<boolean> {
	const project = await req.payload.findByID<Project>({
		collection: 'projects',
		id,
		depth: 1,
	});

	const staffList = (((project.organizer as Guild).staff ?? []) as string[])
		.concat(
			(project.collaborators ?? []) as string[],
		);

	return staffList?.includes(req.user.id);
}

async function fieldCheckProjectOwner(req: PayloadRequest, id?: string): Promise<boolean> {
	if (checkRole(req, 'superadmin')) return true;
	if (!checkRole(req, 'project-owner')) return false;

	if (!id) return true;

	return checkProjectOwner(req, id);
}

// Collection config
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
			if (req.user) return true;

			return {
				_status: {
					equals: 'published',
				},
				status: {
					not_equals: 'draft',
				},
			};
		},
		create: async ({ req, id }) => {
			if (checkRole(req, 'superadmin')) return true;
			if (!checkRole(req, 'project-owner')) return false;

			if (!id) return true;
			return checkProjectOwner(req, id as string);
		},
		update: async ({ req, id }) => {
			if (checkRole(req, 'superadmin')) return true;
			if (!checkRole(req, 'project-owner')) return false;

			if (!id) return true;
			return checkProjectOwner(req, id as string);
		},
		delete: ({ req }) => checkRole(req, 'superadmin'),
	},
	labels: {
		singular: 'Project',
		plural: 'Projects',
	},
	typescript: {
		interface: 'Project',
	},
	versions: {
		drafts: {
			autosave: true,
		},
	},
	hooks: {
		afterChange: [
			() => revalidatePath('/projects'),
			({ doc }) => revalidatePath(`/projects/${doc.slug}`),
		],
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
				update: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
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
				update: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
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
				update: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
			},
		},
		{
			name: 'description',
			type: 'richText',
			required: true,
			localized: true,
			access: {
				update: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
			},
		},
		{
			name: 'organizer',
			type: 'relationship',
			relationTo: 'guilds',
			required: true,
			access: {
				update: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
			},
		},
		{
			name: 'status',
			type: 'select',
			required: true,
			defaultValue: 'ongoing',
			options: [
				{
					label: 'Draft',
					value: 'draft',
				},
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
				update: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
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
				create: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
				update: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
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
					relationTo: 'media',
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
				create: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
				update: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
			},
		},
		{
			name: 'date',
			type: 'date',
			defaultValue: new Date().toISOString(),
			required: true,
			access: {
				update: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
			},
		},
		{
			name: 'image',
			type: 'upload',
			relationTo: 'media',
			required: true,
			access: {
				update: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
			},
		},
		{
			name: 'ogImage',
			type: 'upload',
			relationTo: 'media',
			access: {
				update: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
			},
		},
		{
			name: 'submission-url',
			label: 'Submission link',
			type: 'text',
			admin: {
				description: 'Link where people can submit their message/work',
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
				read: ({ req }) => !!req.user,
				update: ({ req, data }) => fieldCheckProjectOwner(req, data?.id),
			},
		},
		{
			name: 'flags',
			type: 'relationship',
			relationTo: 'flags',
			hasMany: true,
			access: {
				create: ({ req }) => checkRole(req, 'developer'),
				update: ({ req }) => checkRole(req, 'developer'),
			},
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
					type: 'text',
					required: true,
				},
			],
			access: {
				create: ({ req }) => checkRole(req, 'developer'),
				update: ({ req }) => checkRole(req, 'developer'),
			},
		},
	],
};

export default Projects;
