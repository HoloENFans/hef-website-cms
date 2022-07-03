import { GlobalConfig } from 'payload/types';
import checkRole from '../middleware/checkRole';

const FeaturedProjects: GlobalConfig = {
	slug: 'featured-projects',
	label: 'Featured projects',
	access: {
		update: (req) => checkRole(req, 'superadmin'),
	},
	fields: [
		{
			name: 'projects',
			type: 'relationship',
			relationTo: 'projects',
			hasMany: true,
			validate: (value) => {
				if (value.length > 3) {
					return 'You can select no more than 3 projects to feature.';
				}
				return true;
			},
		},
	],
};

export default FeaturedProjects;
