import type { SlateNodeConverter } from '@payloadcms/richtext-lexical';
import {
	cloneDeep,
	convertSlateNodesToLexical,
	convertSlateToLexical,
	defaultSlateConverters,
} from '@payloadcms/richtext-lexical';
import runMigrationFunction from './migrationGenerator';
import {
	Flag, Guild, Media, User,
} from '../../payload-types';

interface OldProject {
	id: string;
	title: string;
	slug: string;
	shortDescription: string;
	description: {
		[k: string]: unknown;
	}[];
	organizers: (string | Guild)[];
	status: 'draft' | 'ongoing' | 'past';
	links?:
	| {
		name: string;
		url: string;
		id?: string | null;
	}[]
	| null;
	media?:
	| {
		type: 'image' | 'video';
		media?: string | Media | null;
		url?: string | null;
		id?: string | null;
	}[]
	| null;
	date: string;
	image: string | Media;
	ogImage?: string | Media | null;
	'submission-url'?: string | null;
	collaborators?: (string | User)[] | null;
	skin:
	| 'holoEN'
	| 'ina'
	| 'amelia'
	| 'gura'
	| 'kiara'
	| 'mori'
	| 'irys'
	| 'sana'
	| 'fauna'
	| 'kronii'
	| 'mumei'
	| 'baelz'
	| 'shiori'
	| 'bijou'
	| 'nerissa'
	| 'fuwawa'
	| 'mococo'
	| 'fuwamoco';
	flags?: (string | Flag)[] | null;
	devprops?:
	| {
		key: string;
		value: string;
		id?: string | null;
	}[]
	| null;
	updatedAt: string;
	createdAt: string;
}

interface Project extends OldProject {
	hasSubmissions: boolean;
}

const SlateANodeConverter: SlateNodeConverter = {
	converter({ converters, slateNode }) {
		return {
			children: convertSlateNodesToLexical({
				canContainParagraphs: false,
				converters,
				parentNodeType: 'link',
				slateNodes: slateNode.children || [],
			}),
			direction: 'ltr',
			fields: {
				...(slateNode.fields || {}),
				doc: slateNode.doc || null,
				linkType: slateNode.linkType || 'custom',
				newTab: slateNode.newTab || false,
				url: slateNode.link || undefined,
			},
			format: '',
			indent: 0,
			type: 'link',
			version: 2,
		};
	},
	nodeTypes: ['a'],
};

const start = async () => {
	const converters = cloneDeep([...defaultSlateConverters, SlateANodeConverter]);

	await runMigrationFunction<OldProject, Project>('projects', async (doc) => {
		const richText = doc.description;

		let converted: any;
		if (richText && Array.isArray(richText) && !('root' in richText)) {
			converted = convertSlateToLexical({
				converters,
				slateData: richText.filter((node) => node.type !== 'thematic_break'),
			});
		}

		return {
			description: converted,
			hasSubmissions: true,
		};
	});
};

start().catch(console.error);
