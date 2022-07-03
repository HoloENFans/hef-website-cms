import { CollectionConfig } from 'payload/types';

const Guilds: CollectionConfig = {
	slug: 'guilds',
	admin: {
		useAsTitle: 'name',
		description: 'Server list on the website',
	},
	labels: {
		singular: 'Guild',
		plural: 'Guilds',
	},
	access: {
		read: ({ req }) => {
			// If there is a user logged in,
			// let them retrieve all documents
			if (req.user) return true;

			// If there is no user,
			// restrict the documents that are returned
			// to only those where `_status` is equal to `published`
			return {
				_status: {
					equals: 'published',
				},
			};
		},
	},
	versions: {
		drafts: {
			autosave: true,
		},
	},
	fields: [
		{
			name: 'name',
			type: 'text',
			required: true,
		},
		{
			name: 'description',
			type: 'textarea',
			required: true,
			localized: true,
		},
		{
			name: 'debutDate',
			label: 'Debut date',
			type: 'date',
			required: true,
		},
		{
			name: 'invite',
			type: 'text',
			required: true,
			admin: {
				description: 'Only provide the invite code, so excluding "discord.gg"',
			},
		},
		{
			name: 'icon',
			type: 'upload',
			relationTo: 'media',
			required: true,
		},
	],
};

export default Guilds;
