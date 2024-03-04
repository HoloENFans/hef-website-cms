import { GlobalConfig } from 'payload/types';
import checkRole from '@/lib/checkRole';
import revalidatePath from '@/lib/revalidatePath';
import { languages } from '@/payload.config';

const FeaturedProjects: GlobalConfig = {
	slug: 'featured-projects',
	label: 'Featured projects',
	admin: {
		hidden: (req) => !checkRole(req, 'superadmin'),
	},
	access: {
		read: () => true,
		update: ({ req }) => checkRole(req, 'superadmin'),
	},
	hooks: {
		afterChange: [
			async () => {
				const tasks = languages.map(async (language) => {
					await revalidatePath(`/${language}`);
				});

				await Promise.all(tasks);
			},
		],
	},
	fields: [
		{
			name: 'projects',
			type: 'relationship',
			relationTo: 'projects',
			hasMany: true,
		},
	],
	typescript: {
		interface: 'FeaturedProject',
	},
};

export default FeaturedProjects;
