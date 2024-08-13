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

// @ts-ignore
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
	const converters = cloneDeep([...defaultSlateConverters, SlateANodeConverter]);

	const events = await payload.db.find({
		collection: 'events',
		pagination: false,
		req,
	}) as any;

	await Promise.all(events.docs.map(async (doc) => {
		const richText = doc.content as any;

		let converted: any;
		if (richText && Array.isArray(richText) && !('root' in richText)) {
			converted = convertSlateToLexical({
				converters,
				slateData: richText.filter((node) => node.type !== 'thematic_break'),
			});
		}

		await payload.update({
			collection: 'events',
			id: doc.id,
			data: {
				content: converted,
			},
		});
	}));
}

export async function down(): Promise<void> {
	throw new Error('Down migrations not supported for lexical migration');
}
