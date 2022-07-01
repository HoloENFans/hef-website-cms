import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import Guilds from './collections/Guilds';
import S3Upload from './plugins/S3Upload';
import Media from './collections/Media';

export default buildConfig({
	serverURL: 'http://localhost:3001',
	cors: [
		'https://holoen.fans',
		'https://dev.holoen.fans',
		'http://localhost:3000',
	],
	admin: {
		user: Users.slug,
		meta: {
			titleSuffix: '- HoloEN Fan Website',
		},
	},
	localization: {
		locales: [
			'en',
			'jp',
		],
		defaultLocale: 'en',
		fallback: true,
	},
	collections: [
		Users,
		Media,
		Guilds,
	],
	plugins: [
		S3Upload({
			region: process.env.S3_REGION,
			endpoint: process.env.S3_ENDPOINT,
			bucket: process.env.S3_BUCKET,
			credentials: {
				accessKeyId: process.env.S3_ACCESS_KEY,
				secretAccessKey: process.env.S3_SECRET_KEY,
			},
		}),
	],
	typescript: {
		outputFile: path.resolve(__dirname, 'payload-types.ts'),
	},
});
