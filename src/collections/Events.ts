import type { CollectionConfig, PayloadRequest } from 'payload/types';
import {
	Project, Event, EventMedia, Guild,
} from '../payload-types';
import revalidatePath from '../lib/revalidatePath';
import { languages } from '../payload.config';
import checkRole from '../lib/checkRole';

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
		read: async () => true,
		// TODO: Approval checking
		// If there is a user logged in,
		// let them retrieve all documents
		/* if (req.user) return true;

			return {
				_status: {
					equals: 'published',
				},
			}; */

		create: ({ req }) => checkRole(req, 'project-owner'),
		update: ({ req }) => checkRole(req, ['project-owner', 'content-moderator']),
		delete: async ({ req, id }) => {
			if (checkRole(req, 'superadmin')) return true;
			if (!checkRole(req, ['project-owner', 'content-moderator'])) return false;

			if (!id) return true;
			const submission = await req.payload.findByID({
				collection: 'submissions',
				id,
				depth: 2,
			});
			const staffList = ((submission.project as Project).organizer as Guild).staff;
			return staffList?.includes(req.user.id);
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
						await revalidatePath(`${language}/projects/${project.slug}`);
					});

					await Promise.all(tasks);
				} else {
					const tasks = languages.map(async (language) => {
						await revalidatePath(`${language}/projects/${doc.project.slug}`);
					});

					await Promise.all(tasks);
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
			admin: {
				elements: ['link', 'blockquote', 'ul', 'ol', 'indent'],
				leaves: ['bold', 'italic', 'underline', 'strikethrough'],
			},
		},
	],
};

export default Events;
