import { PayloadRequest } from 'payload/dist/express/types';

// eslint-disable-next-line max-len
export default ({ req: { user } }: { req: PayloadRequest }, role: string) => (user.roles as string[]).includes(role);
