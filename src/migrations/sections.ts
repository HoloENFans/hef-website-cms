import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-mongodb';

export async function up({ payload }: MigrateUpArgs): Promise<void> {
	await payload.update({
		collection: 'users',
		where: {},
		data: {
			sections: ['hefw'],
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
	});
}
