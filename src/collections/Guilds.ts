import { CollectionConfig } from 'payload/types';
import { PayloadRequest } from 'payload/dist/express/types';
import checkRole from '../lib/checkRole';
import revalidatePath from '../lib/revalidatePath';

const Guilds: CollectionConfig = {
	slug: 'guilds',
	admin: {
		useAsTitle: 'name',
		description: 'Server list on the website',
		preview: () => `${process.env.PAYLOAD_PUBLIC_WEBSITE_URL}/guilds`,
	},
	labels: {
		singular: 'Guild',
		plural: 'Guilds',
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
		create: (req) => checkRole(req, 'superadmin'),
		update: (req) => {
			const isSuperadmin = checkRole(req, 'superadmin');
			if (isSuperadmin) return true;
			const { req: { user } }: { req: PayloadRequest } = req;
			return req.data.staff ? req.data.staff.includes(user.id) : false;
		},
	},
	versions: {
		drafts: {
			autosave: true,
		},
	},
	hooks: {
		afterChange: [
			() => revalidatePath('/'),
		],
	},
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
			localized: true,
		},
		{
			name: 'debutDate',
			label: 'Debut date',
			type: 'date',
			required: true,
		},
		{
			name: 'invite',
			type: 'text',
			required: true,
			admin: {
				description: 'Only provide the invite code, so excluding "discord.gg"',
			},
		},
		{
			name: 'icon',
			type: 'upload',
			relationTo: 'media',
			required: true,
		},
		{
			// TODO: Replace with custom component
			name: 'color',
			type: 'text',
		},
		{
			name: 'staff',
			type: 'relationship',
			relationTo: 'users',
			hasMany: true,
			access: {
				read: (context) => !!context.req.user,
			},
		},
	],
};

export default Guilds;
