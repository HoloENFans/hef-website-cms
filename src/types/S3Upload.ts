import { IncomingUploadType } from 'payload/dist/uploads/types';
import { PutObjectCommandInput, S3ClientConfig } from '@aws-sdk/client-s3';

/* eslint-disable no-unused-vars */
export interface S3UploadConfig {
	endpoint?: string;
	region: string;
	credentials: {
		accessKeyId: string;
		secretAccessKey: string;
	}
	bucket?: string;
	publicUrl?: string;
	otherOptions?: S3ClientConfig;
}

export interface S3IncomingUploadType extends IncomingUploadType {
	s3: {
		bucket?: string;
		prefix?: string | ((doc: Partial<any>) => string);
		commandInput?: PutObjectCommandInput;
	}
}
