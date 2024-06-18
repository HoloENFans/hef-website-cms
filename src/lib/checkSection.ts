import { PayloadRequest } from 'payload/dist/express/types';
import { User } from 'payload/auth';

export default ({ user, context }: { user: User, context?: PayloadRequest['context'] }, section: string) => {
	if (context?.action === 'migration') return true;

	if ((user.roles as string[]).includes('superadmin')) return true;

	return (user.sections as string[]).includes(section);
};
