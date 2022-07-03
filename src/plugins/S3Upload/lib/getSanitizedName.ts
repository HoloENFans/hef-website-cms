import { Payload } from 'payload';
import sanitize from 'sanitize-filename';
import fileExists from './fileExists';

// eslint-disable-next-line max-len
export default async function getSanitizedName(payload: Payload, collection: string, filename: string) {
	let modifiedFilename = sanitize(filename.substring(0, filename.lastIndexOf('.')) ?? filename);
	const extension = filename.split('.').pop();
	const regex = /(.*)-(\d)$/;

	function incrementName() {
		const found = modifiedFilename.match(regex);

		if (found === null) {
			modifiedFilename += `-1.${extension}`;
		} else {
			const matchedName = found[1];
			const matchedNumber = found[2];
			const incremented = Number.parseInt(matchedNumber, 10) + 1;

			modifiedFilename = `${matchedName}-${incremented}.${extension}`;
		}
	}

	// eslint-disable-next-line no-await-in-loop
	while (await fileExists(payload, collection, modifiedFilename)) {
		incrementName();
	}

	return filename;
}
