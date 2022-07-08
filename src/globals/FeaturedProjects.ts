import { GlobalConfig } from 'payload/types';
import checkRole from '../lib/checkRole';
import revalidatePath from '../lib/revalidatePath';

const FeaturedProjects: GlobalConfig = {
	slug: 'featured-projects',
	label: 'Featured projects',
	access: {
		read: () => true,
		update: (req) => checkRole(req, 'superadmin'),
	},
	hooks: {
		afterChange: [
			() => revalidatePath('/'),
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
};

export default FeaturedProjects;
