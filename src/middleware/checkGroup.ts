import { PayloadRequest } from 'payload/dist/express/types';

export default ({ req: { user } }: { req: PayloadRequest }, group: string) => user.group === group;
