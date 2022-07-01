import { buildConfig } from 'payload/config';
import path from 'path';
// import Examples from './collections/Examples';
import Users from './collections/Users';

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
		// Add Collections here
		// Examples,
	],
	typescript: {
		outputFile: path.resolve(__dirname, 'payload-types.ts'),
	},
});
