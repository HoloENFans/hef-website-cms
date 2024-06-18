import { MigrateUpArgs } from '@payloadcms/db-mongodb';
import type { SlateNodeConverter } from '@payloadcms/richtext-lexical';
import {
	cloneDeep,
	convertSlateNodesToLexical,
	convertSlateToLexical,
	defaultSlateConverters,
} from '@payloadcms/richtext-lexical';

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

export async function up({ payload }: MigrateUpArgs): Promise<void> {
	const converters = cloneDeep([...defaultSlateConverters, SlateANodeConverter]);

	const projects = await payload.find({
		collection: 'projects',
		pagination: false,
		showHiddenFields: true,
		overrideAccess: true,
		depth: 1,
		context: {
			action: 'migration',
		},
	});

	await Promise.all(projects.docs.map(async (doc) => {
		const richText = doc.description as any;

		let converted: any;
		if (richText && Array.isArray(richText) && !('root' in richText)) {
			converted = convertSlateToLexical({
				converters,
				slateData: richText.filter((node) => node.type !== 'thematic_break'),
			});
		}

		await payload.update({
			collection: 'projects',
			id: doc.id,
			data: {
				description: converted,
				hasSubmissions: true,
			},
			overrideAccess: true,
			context: {
				action: 'migration',
			},
		});
	}));
}

export async function down(): Promise<void> {
	throw new Error('Down migrations not supported for lexical migration');
}
