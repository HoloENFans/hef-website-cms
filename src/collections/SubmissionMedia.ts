import { CollectionConfig } from 'payload/types';
import { PayloadRequest } from 'payload/dist/express/types';
import checkRole from '../middleware/checkRole';
import { S3IncomingUploadType } from '../types/S3Upload';

const Media: CollectionConfig = {
	slug: 'submission-media',
	admin: {
		disableDuplicate: true,
		description: 'Media for project submissions',
	},
	labels: {
		singular: 'Submission media',
		plural: 'Submission media',
	},
	access: {
		read: () => true,
		create: (req) => checkRole(req, 'admin'),
		update: async (req) => {
			if (checkRole(req, 'superadmin')) return true;

			if (!checkRole(req, 'admin') || !checkRole(req, 'content-moderator')) return false;

			const { req: { payload }, id }: { req: PayloadRequest, id: string } = req;
			const results = await payload.find({
				collection: 'submissions',
				where: {
					media: {
						equals: id,
					},
				},
			});

			return true;
		},
		// TODO: Add check for content moderators and if they are assigned to a project
		delete: (req) => checkRole(req, 'admin'),
	},
	upload: {
		disableLocalStorage: process.env.NODE_ENV === 'production',
		staticDir: '../storage/submissions',
		s3: {
			// TODO: Make this a function to include the project id
			prefix: 'submissions',
		},
		imageSizes: [
			{
				name: 'icon',
				width: 128,
				height: 128,
				crop: 'center',
			},
		],
		adminThumbnail: 'icon',
	} as S3IncomingUploadType,
	fields: [],
};

export default Media;
