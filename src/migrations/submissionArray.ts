import runMigrationFunction from './migrationGenerator';
import { Project, SubmissionMedia } from '../payload-types';

interface OldSubmission {
	id: string;
	project: string | Project;
	author: string;
	srcIcon?: string | SubmissionMedia;
	type: 'text' | 'image' | 'video';
	subtype?: 'artwork' | 'picture' | 'other';
	message?: string;
	media?: string | SubmissionMedia;
	url?: string;
	devprops: {
		key: string;
		value: string;
		id?: string;
	}[];
	_status?: 'draft' | 'published';
	createdAt: string;
	updatedAt: string;
}

interface Submission {
	id: string;
	project: string | Project;
	author: string;
	srcIcon?: string | SubmissionMedia;
	message?: string;
	media: {
		type: 'image' | 'video';
		subtype?: 'artwork' | 'picture' | 'other';
		image?: string | SubmissionMedia;
		url?: string;
		id?: string;
	}[];
	devprops: {
		key: string;
		value: string;
		id?: string;
	}[];
	createdAt: string;
	updatedAt: string;
}

const start = async () => {
	await runMigrationFunction<OldSubmission, Submission>('submissions', async (doc) => {
		if (doc.type === 'image' && !Array.isArray(doc.media)) {
			return {
				type: null,
				subtype: null,
				media: [
					{
						type: 'image',
						subtype: doc.subtype,
						image: doc.media,
					},
				],
			};
		}

		if (doc.type === 'video' && !Array.isArray(doc.media)) {
			return {
				type: null,
				subtype: null,
				media: [
					{
						type: 'video',
						url: doc.url,
					},
				],
			};
		}

		return {
			type: null,
			subtype: null,
		};
	});

	// TODO: Automatically clear type and subtype field
	// FOr now, manually use: db.submissions.updateMany({}, [{ $unset: ["type", "subtype"] }]);

	process.exit(0);
};

// eslint-disable-next-line no-void
void start();
