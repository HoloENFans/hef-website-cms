import { User } from 'payload/auth';

export default ({ user }: { user: User }, role: string | string[]) => {
	if (process.env.PAYLOAD_MIGRATING === 'true') return true;

	if (!user) return false;

	try {
		if ((user.roles as string[]).includes('superadmin')) return true;

		if (role instanceof Array) {
			const map = role.map((roleName) => (user.roles as string[]).includes(roleName));
			return map.includes(true);
		}

		return (user.roles as string[]).includes(role);
	} catch (e) {
		console.error(e);
		console.error('Failed to check the following user: ', user);

		return false;
	}
};
