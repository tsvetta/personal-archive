import 'dotenv/config';

import os from 'os';
import fs from 'fs';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const homeDirectory = os.homedir();

const applicationURL = process.env.BB_URL || '';
const applicationKeyId = process.env.BB_Id || '';
const applicationKey = process.env.BB_Key || '';
const BBbucketName = process.env.BB_Bucket_name || '';
const rootDirName = process.env.ROOT_FILE_DIR_NAME || '';
const localFilesPath = process.env.LOCAL_FILES_PATH_HOME || '';
const localFilesDir = path.join(homeDirectory, localFilesPath);

const s3 = new S3Client({
  endpoint: applicationURL,
  region: 'us-west-004',
  credentials: {
    accessKeyId: applicationKeyId,
    secretAccessKey: applicationKey,
  },
});

async function uploadFileToBB(filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const filePathEnd = filePath.split(`/${rootDirName}/`)[1];

  const uploadParams = {
    Bucket: BBbucketName,
    Key: `${rootDirName}/${filePathEnd}`, // почему нет вложенных папок?
    Body: fileStream,
    CacheControl: 'public, max-age=31536000, immutable',
  };

  try {
    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });

    await upload.done();

    console.log(`File uploaded successfully: ${filePathEnd}`);
  } catch (err: any) {
    console.error(`Error uploading file ${filePathEnd}: ${err.message}`);
    console.error(err);
  }
}

export async function processDirectory(
  directory: string,
  processingCallback: (path: string) => void
) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath, processingCallback);
    } else {
      try {
        if (!file.includes('.DS_Store')) {
          await processingCallback(fullPath);
        }
      } catch (error) {
        console.error(`Error uploading file ${file}:`, error);
      }
    }
  }
}

processDirectory(localFilesDir, uploadFileToBB)
  .then(() => console.log('All uploaded!'))
  .catch((error) => console.error('Error uploading:', error));
