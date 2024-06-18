import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb';

export async function up({ payload }: MigrateUpArgs): Promise<void> {
	await payload.update({
		collection: 'users',
		where: {},
		data: {
			sections: ['hefw'],
		},
		context: {
			action: 'migration',
		},
	});
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
	await payload.update({
		collection: 'users',
		where: {},
		data: {
			sections: null,
		},
		context: {
			action: 'migration',
		},
	});
}
