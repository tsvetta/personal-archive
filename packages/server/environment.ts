import 'dotenv/config';

export const isProduction = process.env.NODE_ENV === 'production';
export const base = process.env.BASE || '/';
export const port = process.env.PORT || 5173;
export const secret = process.env.SECRET_KEY || '';
export const dbURI = process.env.MongoURI || '';

export const bbApplicationKeyId = process.env.BB_Id || '';
export const bbApplicationKey = process.env.BB_Key || '';
export const bbBucketId = process.env.BB_Bucket_Id || '';
export const bbCDNUrl = process.env.CDN_URL || '';
