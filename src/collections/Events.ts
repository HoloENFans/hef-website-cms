import type { CollectionConfig, PayloadRequest } from 'payload/types';
import { User } from 'payload/auth';
import {
	Project, Event, EventMedia, Guild,
} from '../payload-types';
import revalidatePath from '../lib/revalidatePath';
import { languages } from '../payload.config';
import checkRole from '../lib/checkRole';
import revalidateTag from '../lib/revalidateTag';

const Events: CollectionConfig = {
	slug: 'events',
	admin: {
		useAsTitle: 'title',
		description: 'Event list',
		defaultColumns: ['title', 'project'],
	},
	labels: {
		singular: 'Event',
		plural: 'Events',
	},
	access: {
		read: () => true,
		create: ({ req }) => checkRole(req, 'project-owner'),
		update: ({ req }) => checkRole(req, ['project-owner', 'content-moderator']),
		delete: async ({ req, id }) => {
			if (!checkRole(req, ['project-owner', 'content-moderator'])) return false;

			if (!id) return true;
			const event: Event = await req.payload.findByID({
				collection: 'events',
				id,
				depth: 2,
			});
			const project = event.project as Project;
			const staffList = ((project.organizers as Guild[])
				.flatMap((guild) => guild.staff)) as string[];
			const collaborators = (project.collaborators as unknown as User[]).map((user) => user.id);
			return collaborators?.includes(req.user.id) || staffList?.includes(req.user.id);
		},
	},
	hooks: {
		afterDelete: [
			async ({ req, doc }: { req: PayloadRequest, doc: Event }) => {
				// Delete any images connected to this event
				await Promise.all(doc.images.map(async (media) => {
					await req.payload.delete({
						collection: 'event-media',
						id: (media.image as EventMedia | undefined)?.id ?? media.image as string,
						overrideAccess: true,
					});
				}));
			},
		],
		afterChange: [
			async ({ req, doc }) => {
				if (doc.project instanceof String) {
					const project: Project = await req.payload.findByID({
						collection: 'projects',
						id: doc.project,
						depth: 0,
					});
					const tasks = languages.map(async (language) => {
						await revalidatePath(`/${language}/projects/${project.slug}`);
					});

					await Promise.all(tasks);

					await revalidateTag(project.slug);
				} else {
					const tasks = languages.map(async (language) => {
						await revalidatePath(`/${language}/projects/${doc.project.slug}`);
					});

					await Promise.all(tasks);

					await revalidateTag(doc.project.slug);
				}
			},
		],
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true,
		},
		{
			name: 'project',
			type: 'relationship',
			relationTo: 'projects',
			required: true,
			index: true,
		},
		{
			name: 'date',
			type: 'date',
			required: true,
			admin: {
				description:
					'Date and time of the event. Enter in your local time, it will be auto converted to UTC. You can also edit the date/time value directly in the text box.',
				date: {
					pickerAppearance: 'dayAndTime',
					timeIntervals: 15,
				},
			},
		},
		{
			name: 'images',
			type: 'array',
			required: true,
			fields: [
				{
					name: 'image',
					type: 'upload',
					relationTo: 'event-media',
				},
			],
		},
		{
			name: 'backgroundImage',
			type: 'upload',
			required: false,
			relationTo: 'event-media',
		},
		{
			name: 'content',
			type: 'richText',
			required: true,
		},
		{
			name: 'devprops',
			label: 'Developer properties',
			labels: {
				singular: 'Property',
				plural: 'Developer properties',
			},
			type: 'array',
			fields: [
				{
					name: 'key',
					type: 'text',
					required: true,
				},
				{
					name: 'value',
					type: 'text',
					required: true,
				},
			],
			access: {
				create: ({ req }) => checkRole(req, 'developer'),
				update: ({ req }) => checkRole(req, 'developer'),
			},
			admin: {
				condition: (_data, _siblingData, req) => checkRole(req, 'developer'),
			},
		},
	],
};

export default Events;
