import 'dotenv/config';

import { exec } from 'child_process';
import { bbUrl } from '../environment';

const s3Path = process.env.S3_PATH || '';
const localFilesPath = process.env.LOCAL_FILES_PATH_ROOT || '';

const command = `aws s3 sync ${localFilesPath} ${s3Path} --endpoint-url=${bbUrl} --cache-control 'public, max-age=31536000, immutable' --exclude='*.DS_Store' --delete`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Ошибка при выполнении команды: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Ошибка: ${stderr}`);
    return;
  }
  console.log(`Результат выполнения:\n${stdout}`);
});
