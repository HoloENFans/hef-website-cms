/* eslint-disable no-unused-vars */

declare namespace Express {
	export interface Request {
		user: {
			name: string;
			email: string;
			group: string;
		}
	}
}
