import { User } from 'payload/auth';

export default ({ user }: { user: User }, section: string) => {
	if (!user) return false;

	if (process.env.PAYLOAD_MIGRATING === 'true') return true;

	if ((user.roles as string[]).includes('superadmin')) return true;

	return (user.sections as string[]).includes(section);
};
