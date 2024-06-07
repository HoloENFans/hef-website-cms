import { buildConfig } from 'payload/config';
import path from 'path';
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { webpackBundler } from '@payloadcms/bundler-webpack';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import corsList from './lib/corsList';

// Collections
import Users from './collections/Users';
import Guilds from './collections/Guilds';
import Media from './collections/Media';
import SubmissionMedia from './collections/SubmissionMedia';
import Projects from './collections/Project';
import ExternalProjects from './collections/ExternalProjects';
import Submissions from './collections/Submissions';
import FeaturedProjects from './globals/FeaturedProjects';
import Flags from './collections/Flags';
import Notice from './globals/Notice';
import Events from './collections/Events';
import EventMedia from './collections/EventMedia';
import Forms from './collections/Forms';
import FormSubmissions from './collections/FormSubmissions';
import Fanmerch from './collections/Fanmerch';
import People from './collections/People';
import Links from './collections/Links';

// Components
/* eslint-disable import/extensions */
import Icon from './components/branding/Icon';
import Logo from './components/branding/Logo';
/* eslint-enable */

const adapter = s3Adapter({
	config: {
		endpoint: process.env.S3_ENDPOINT,
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY,
			secretAccessKey: process.env.S3_SECRET_KEY,
		},
		forcePathStyle: process.env.S3_PATH_STYLE === 'true',
		region: process.env.S3_REGION,
	},
	bucket: process.env.S3_BUCKET,
});

export const languages = ['en', 'jp'];

export default buildConfig({
	serverURL: process.env.PUBLIC_URL,
	csrf: [
		process.env.PUBLIC_URL,
		'https://holoen.fans',
		'https://dev.holoen.fans',
		'http://localhost:3000',
	],
	cors: corsList,
	rateLimit: {
		trustProxy: true,
		skip: (req) => req.header('X-RateLimit-Bypass')
			=== process.env.PAYLOAD_BYPASS_RATE_LIMIT_KEY,
	},
	admin: {
		bundler: webpackBundler(),
		user: Users.slug,
		meta: {
			titleSuffix: '- HoloEN Fan Website CMS',
			favicon: '/assets/favicon.svg',
		},
		css: path.resolve(__dirname, 'styles/styles.css'),
		components: {
			graphics: {
				Icon,
				Logo,
			},
		},
	},
	editor: lexicalEditor({}),
	localization: {
		locales: languages,
		defaultLocale: 'en',
		fallback: true,
	},
	collections: [
		Users,
		Media,
		Guilds,
		SubmissionMedia,
		Projects,
		ExternalProjects,
		Submissions,
		Flags,
		Events,
		EventMedia,
		Forms,
		FormSubmissions,
		Fanmerch,
		People,
		Links,
	],
	globals: [FeaturedProjects, Notice],
	plugins: [
		cloudStorage({
			enabled: process.env.NODE_ENV === 'production',
			collections: {
				media: {
					adapter,
					prefix: 'media',
					generateFileURL: ({ filename, prefix }) => `${process.env.S3_PUBLIC_URL}/${
						prefix ? `${prefix}/` : ''
					}${filename}`,
				},
				'submission-media': {
					adapter,
					prefix: 'submissions',
					generateFileURL: ({ filename, prefix }) => `${process.env.S3_PUBLIC_URL}/${
						prefix ? `${prefix}/` : ''
					}${filename}`,
				},
				'event-media': {
					adapter,
					prefix: 'event-media',
					generateFileURL: ({ filename, prefix }) => `${process.env.S3_PUBLIC_URL}/${
						prefix ? `${prefix}/` : ''
					}${filename}`,
				},
			},
		}),
	],
	graphQL: {
		disable: true,
	},
	upload: {
		limits: {
			fileSize: 50_000_000,
		},
	},
	typescript: {
		outputFile: path.resolve(__dirname, 'payload-types.ts'),
	},
	maxDepth: 10,
	db: mongooseAdapter({
		url: process.env.MONGODB_URI,
	}),
});
