/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    users: User;
    media: Media;
    guilds: Guild;
    'submission-media': SubmissionMedia;
    projects: Project;
    submissions: Submission;
    flags: Flag;
    events: Event;
    'event-media': EventMedia;
    forms: Form;
    'form-submissions': FormSubmission;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {
    'featured-projects': FeaturedProject;
    notice: Notice;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  name: string;
  sections: ('hefw' | 'timelinerys' | 'dokomi-fan-booth')[];
  roles: ('superadmin' | 'project-owner' | 'content-moderator' | 'developer' | 'translator' | 'misc')[];
  updatedAt: string;
  createdAt: string;
  enableAPIKey?: boolean | null;
  apiKey?: string | null;
  apiKeyIndex?: string | null;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  _verified?: boolean | null;
  _verificationToken?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  prefix?: string | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "guilds".
 */
export interface Guild {
  id: string;
  name: string;
  description: string;
  debutDate: string;
  invite: string;
  icon: string | Media;
  staff?: (string | User)[] | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "submission-media".
 */
export interface SubmissionMedia {
  id: string;
  prefix?: string | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "projects".
 */
export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: {
    [k: string]: unknown;
  }[];
  organizers: (string | Guild)[];
  status: 'draft' | 'submissions-open' | 'submissions-closed' | 'ongoing' | 'past';
  links?:
    | {
        name: string;
        url: string;
        id?: string | null;
      }[]
    | null;
  media?:
    | {
        type: 'image' | 'video';
        media?: string | Media | null;
        url?: string | null;
        id?: string | null;
      }[]
    | null;
  date: string;
  image: string | Media;
  ogImage?: string | Media | null;
  'submission-url'?: string | null;
  collaborators?: (string | User)[] | null;
  skin:
    | 'holoEN'
    | 'ina'
    | 'amelia'
    | 'gura'
    | 'kiara'
    | 'mori'
    | 'irys'
    | 'sana'
    | 'fauna'
    | 'kronii'
    | 'mumei'
    | 'baelz'
    | 'shiori'
    | 'bijou'
    | 'nerissa'
    | 'fuwawa'
    | 'mococo'
    | 'fuwamoco';
  flags?: (string | Flag)[] | null;
  devprops?:
    | {
        key: string;
        value: string;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "flags".
 */
export interface Flag {
  id: string;
  code: string;
  name: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "submissions".
 */
export interface Submission {
  id: string;
  project: string | Project;
  author: string;
  srcIcon?: string | SubmissionMedia | null;
  message?: string | null;
  media?:
    | {
        type: 'image' | 'video';
        subtype?: ('artwork' | 'picture' | 'other') | null;
        image?: string | SubmissionMedia | null;
        url?: string | null;
        id?: string | null;
      }[]
    | null;
  status: 'unchecked' | 'rejected' | 'accepted';
  filterableAttributes?:
    | {
        name: string;
        values?:
          | {
              value: string;
              id?: string | null;
            }[]
          | null;
        id?: string | null;
      }[]
    | null;
  devprops?:
    | {
        key: string;
        value: string;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "events".
 */
export interface Event {
  id: string;
  title: string;
  project: string | Project;
  date: string;
  images: {
    image?: string | EventMedia | null;
    id?: string | null;
  }[];
  backgroundImage?: string | EventMedia | null;
  content: {
    [k: string]: unknown;
  }[];
  devprops?:
    | {
        key: string;
        value: string;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "event-media".
 */
export interface EventMedia {
  id: string;
  alt?: string | null;
  prefix?: string | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "forms".
 */
export interface Form {
  id: string;
  name: string;
  description: string;
  isSubmissionForm: 'true' | 'false';
  project?: (string | null) | Project;
  status: 'open' | 'closed';
  skin:
    | 'holoEN'
    | 'ina'
    | 'amelia'
    | 'gura'
    | 'kiara'
    | 'mori'
    | 'irys'
    | 'sana'
    | 'fauna'
    | 'kronii'
    | 'mumei'
    | 'baelz'
    | 'shiori'
    | 'bijou'
    | 'nerissa'
    | 'fuwawa'
    | 'mococo'
    | 'fuwamoco';
  form:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "form-submissions".
 */
export interface FormSubmission {
  id: string;
  form: string | Form;
  data:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  media?:
    | {
        image?: string | SubmissionMedia | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "featured-projects".
 */
export interface FeaturedProject {
  id: string;
  projects?: (string | Project)[] | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "notice".
 */
export interface Notice {
  id: string;
  enabled?: boolean | null;
  description?: string | null;
  message?:
    | {
        [k: string]: unknown;
      }[]
    | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}