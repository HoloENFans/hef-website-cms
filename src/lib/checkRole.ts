import { PayloadRequest } from 'payload/dist/express/types';
import { User } from 'payload/auth';

export default ({ user, context }: { user: User, context?: PayloadRequest['context'] }, role: string | string[]) => {
	if (context.action === 'migration') return true;

	if ((user.roles as string[]).includes('superadmin')) return true;

	if (role instanceof Array) {
		const map = role.map((roleName) => (user.roles as string[]).includes(roleName));
		return map.includes(true);
	}

	return (user.roles as string[]).includes(role);
};
