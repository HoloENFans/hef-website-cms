import { IncomingUploadType } from 'payload/dist/uploads/types';
import { PutObjectCommandInput } from '@aws-sdk/client-s3';

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
		prefix?: string;
		commandInput?: PutObjectCommandInput;
	}
}
