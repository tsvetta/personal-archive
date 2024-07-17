import 'dotenv/config';
import B2 from 'backblaze-b2';

const applicationKeyId = process.env.BB_Id || '';
const applicationKey = process.env.BB_Key || '';
const bucketId = process.env.BB_Bucket_Id || '';
const bbCDNUrl = process.env.CDN_URL || '';

export const getBBCDNPhotos = () => {
  const b2 = new B2({
    applicationKeyId,
    applicationKey,
  });

  return b2
    .authorize()
    .then(() => {
      return b2.listFileNames({
        bucketId,
        maxFileCount: 1000,
      } as any);
    })
    .then((response: any) => {
      const files = response.data.files;
      const urls = files.map((file: any) => {
        return {
          url: `${bbCDNUrl}/${file.fileName}`,
        };
      });

      return urls;
    })
    .catch((err) => {
      console.error('Ошибка при получении списка файлов:', err);
    });
};
