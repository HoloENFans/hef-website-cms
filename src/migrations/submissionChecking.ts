import runMigrationFunction from './migrationGenerator';
import { Project, SubmissionMedia } from '../payload-types';

interface OldSubmission {
	id: string;
	project: string | Project;
	author: string;
	srcIcon?: string | SubmissionMedia;
	message?: string;
	media?: {
		type: 'image' | 'video';
		subtype?: 'artwork' | 'picture' | 'other';
		image?: string | SubmissionMedia;
		url?: string;
		id?: string;
	}[];
	filterableAttributes?: {
		name: string;
		values?: {
			value: string;
			id?: string;
		}[];
		id?: string;
	}[];
	devprops?: {
		key: string;
		value: string;
		id?: string;
	}[];
	updatedAt: string;
	createdAt: string;
}

interface Submission extends OldSubmission {
	status: 'unchecked' | 'rejected' | 'accepted';
}

const start = async () => {
	await runMigrationFunction<OldSubmission, Submission>('submissions', async () => ({
		status: 'accepted',
	}));

	process.exit(0);
};

// eslint-disable-next-line no-void
void start();
