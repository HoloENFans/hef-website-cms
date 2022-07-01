import { Request } from 'express';

export default ({ req: { user } }: { req: Request }, group: string) => user.group === group;
