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
		description: 'Project organizers',
		preview: () => `${process.env.PAYLOAD_PUBLIC_WEBSITE_URL}`,
		hidden: (req) => !checkSection(req, 'hefw'),
	},
	labels: {
		singular: 'Organizer',
		plural: 'Organizers',
	},
	access: {
		read: () => true,
		create: ({ req }) => checkRole(req, 'superadmin'),
		update: ({ req, data }) => {
			if (checkRole(req, 'superadmin')) return true;

			return (
				data?.staff
					? (
						data.staff.includes(req.user.id)
						|| data.staff.findIndex((user) => user.id === req.user.id) > -1
					)
					: false
			);
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
			name: 'staff',
			type: 'relationship',
			relationTo: 'users',
			hasMany: true,
			access: {
				read: (context) => !!context.req.user,
			},
			defaultValue: ({ user }) => ([user.id]),
			admin: {
				description: 'Staff members, these are allowed to modify this document and projects associated with this organizer',
			},
		},
	],
};

export default Guilds;
