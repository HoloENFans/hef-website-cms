import { PayloadRequest } from 'payload/dist/express/types';
import { User } from 'payload/auth';

export default ({ user, payloadAPI }: PayloadRequest & { user: User }, role: string | string[]) => {
	if (payloadAPI === 'local') return true;

	if ((user.roles as string[]).includes('superadmin')) return true;

	if (role instanceof Array) {
		const map = role.map((roleName) => (user.roles as string[]).includes(roleName));
		return map.includes(true);
	}

	return (user.roles as string[]).includes(role);
};
