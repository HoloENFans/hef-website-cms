import { buildConfig } from 'payload/config';
import path from 'path';
import S3Upload from './plugins/S3Upload';

// Collections
import Users from './collections/Users';
import Guilds from './collections/Guilds';
import Media from './collections/Media';
import SubmissionMedia from './collections/SubmissionMedia';
import Projects from './collections/Project';
import Submissions from './collections/Submissions';
import FeaturedProjects from './globals/FeaturedProjects';
import Flags from './collections/Flags';
import Notice from './globals/Notice';

export default buildConfig({
	serverURL: process.env.PUBLIC_URL,
	csrf: [
		process.env.PUBLIC_URL,
		'https://holoen.fans',
		'https://dev.holoen.fans',
		'http://localhost:3000',
	],
	cors: [
		'https://holoen.fans',
		'https://dev.holoen.fans',
		'http://localhost:3000',
	],
	rateLimit: {
		trustProxy: true,
	},
	admin: {
		user: Users.slug,
		meta: {
			titleSuffix: '- Hololive EN Fan Website',
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
		SubmissionMedia,
		Projects,
		Submissions,
		Flags,
	],
	globals: [
		FeaturedProjects,
		Notice,
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
			publicUrl: process.env.S3_PUBLIC_URL,
		}),
	],
	graphQL: {
		disable: true,
	},
	upload: {
		limits: {
			fileSize: 20_000_000,
		},
	},
	typescript: {
		outputFile: path.resolve(__dirname, 'payload-types.ts'),
	},
	maxDepth: 10,
});
