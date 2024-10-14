import 'dotenv/config';

import os from 'os';
import fs from 'fs';
import path from 'path';
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  ListObjectsV2CommandOutput,
} from '@aws-sdk/client-s3';

import { bbUrl, bbApplicationKeyId, bbApplicationKey } from '../environment';

const homeDirectory = os.homedir();
const bbBucketName = process.env.BB_Bucket_name || '';
const rootDirName = process.env.ROOT_FILE_DIR_NAME || '';
const localFilesPath = process.env.LOCAL_FILES_PATH_HOME || '';
const localFilesDir = path.join(homeDirectory, localFilesPath);

const s3 = new S3Client({
  endpoint: bbUrl,
  region: 'us-west-004',
  credentials: {
    accessKeyId: bbApplicationKeyId,
    secretAccessKey: bbApplicationKey,
  },
});

async function listS3Files() {
  const params = {
    Bucket: bbBucketName,
    Prefix: `${rootDirName}/`,
  };

  try {
    const data: ListObjectsV2CommandOutput = await s3.send(
      new ListObjectsV2Command(params)
    );
    return (
      data.Contents?.map((item) => item.Key?.replace(`${rootDirName}/`, '')) ||
      []
    );
  } catch (err: any) {
    console.error(`Error listing S3 files: ${err.message}`);
    throw err;
  }
}

function listLocalFiles(directory: string): string[] {
  const files: string[] = [];

  function traverseDir(currentDir: string) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDir(fullPath);
      } else if (!item.includes('.DS_Store')) {
        const fileShortPath = fullPath.replace(localFilesDir, '');
        files.push(fileShortPath);
      }
    }
  }

  traverseDir(directory);

  return files;
}
export async function deleteMissingFiles() {
  try {
    const localFiles = listLocalFiles(localFilesDir);
    const s3Files = await listS3Files();

    const filesToDelete = s3Files.filter(
      (file) => !(file && localFiles.includes(file))
    );

    console.log('Files to delete:', filesToDelete);

    if (filesToDelete.length > 0) {
      const deleteParams = {
        Bucket: bbBucketName,
        Delete: {
          Objects: filesToDelete.map((file) => ({
            Key: `${rootDirName}/${file}`,
          })),
        },
      };
      await s3.send(new DeleteObjectsCommand(deleteParams));
      console.log(`Deleted files: ${filesToDelete.join(', ')}`);
    } else {
      console.log('No files to delete');
    }
  } catch (err: any) {
    console.error(`Error deleting files: ${err.message}`);
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

deleteMissingFiles()
  .then(() => console.log('All missing files deleted!'))
  .catch((error) => console.error('Error deleting:', error));
