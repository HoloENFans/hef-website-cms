import { CollectionConfig } from 'payload/types';
import checkRole from '../lib/checkRole';

const Links: CollectionConfig = {
	slug: 'links',
	admin: {
		useAsTitle: 'url',
		description: 'Links to other platforms',
	},
	access: {
		read: () => true,
		create: ({ req }) => checkRole(req, ['developer']),
		update: ({ req }) => checkRole(req, ['developer']),
		delete: ({ req }) => checkRole(req, ['developer']),
	},
	fields: [
		{
			name: 'kind',
			label: 'Kind',
			type: 'select',
			required: true,
			options: [
				'website',
				'discord',
				'github',
				'linkedin',
				'x',
				'mastodon',
				'instagram',
				'facebook',
				'youtube',
				'twitch',
				'linktree',
				'other',
			],
		},
		{
			name: 'url',
			label: 'URL',
			type: 'text',
			required: true,
		},
	],
};

export default Links;
