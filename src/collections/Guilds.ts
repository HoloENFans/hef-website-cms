import { CollectionConfig } from 'payload/types';
import checkRole from '../lib/checkRole';
import revalidatePath from '../lib/revalidatePath';
import { languages } from '../payload.config';
import revalidateTag from '../lib/revalidateTag';
import checkSection from '../lib/checkSection';

const Guilds: CollectionConfig = {
	slug: 'guilds',
	admin: {
		useAsTitle: 'name',
		description: 'Server list on the website',
		preview: () => `${process.env.PAYLOAD_PUBLIC_WEBSITE_URL}`,
		hidden: (req) => !checkSection(req, 'hefw'),
	},
	labels: {
		singular: 'Guild',
		plural: 'Guilds',
	},
	access: {
		read: () => true,
		create: ({ req }) => checkRole(req, 'superadmin'),
		update: ({ req, data }) => {
			if (checkRole(req, 'superadmin')) return true;

			return data?.staff ? data.staff.includes(req.user.id) : false;
		},
	},
	hooks: {
		afterChange: [
			async () => {
				const tasks = languages.map(async (language) => {
					await revalidatePath(`/${language}`);
				});
				await revalidateTag('guilds');

				await Promise.all(tasks);
			},
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
