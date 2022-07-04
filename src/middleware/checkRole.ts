import { PayloadRequest } from 'payload/dist/express/types';

export default ({ req: { user } }: { req: PayloadRequest }, role: string) => (user.roles as string[]).includes('superadmin') ?? (user.roles as string[]).includes(role);
