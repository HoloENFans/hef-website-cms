import { IncomingUploadType } from 'payload/dist/uploads/types';
import { PutObjectCommandInput } from '@aws-sdk/client-s3';

/* eslint-disable no-unused-vars */
export interface S3UploadConfig {
	region: string;
	endpoint?: string;
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	}
	bucket?: string;
	publicUrl?: string;
}

export interface S3IncomingUploadType extends IncomingUploadType {
	s3: {
		bucket?: string;
		prefix?: string | ((doc: Partial<any>) => string);
		commandInput?: PutObjectCommandInput;
	}
}
