import { PayloadRequest } from 'payload/dist/express/types';
import { User } from 'payload/auth';

export default ({ user, payloadAPI }: PayloadRequest & { user: User }, section: string) => {
	if (payloadAPI === 'local') return true;

	if ((user.roles as string[]).includes('superadmin')) return true;

	return (user.sections as string[]).includes(section);
};
