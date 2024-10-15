import 'dotenv/config';
import B2 from 'backblaze-b2';
import {
  bbApplicationKeyId,
  bbApplicationKey,
  bbBucketId,
  bbCDNUrl,
} from '@archive/common/environment.js';

export const getBBCDNPhotos = (
  maxFileCount?: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startFileName?: string
) => {
  const b2 = new B2({
    applicationKeyId: bbApplicationKeyId,
    applicationKey: bbApplicationKey,
  });

  return b2
    .authorize()
    .then(() => {
      return b2.listFileNames({
        bucketId: bbBucketId,
        maxFileCount,
        startFileName: '',
      } as any);
    })
    .then((response: any) => {
      const files = response.data?.files?.reduce((acc: any[], f: any) => {
        const isPreview = f.fileName.includes('_thumb');
        if (isPreview) {
          return acc;
        }

        const filePath = f.fileName.split('.')[0];
        const fileExt = f.fileName.split('.')[1];
        const isImage = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(
          fileExt.toLowerCase()
        );

        acc.push({
          fileUrl: `${bbCDNUrl}/${f.fileName}`,
          filePreview: isImage
            ? `${bbCDNUrl}/${filePath}_thumb.${fileExt}`
            : undefined,
          published: false,
        });

        return acc;
      }, []);

      const nextFileName =
        files.length > 0 ? files[files.length - 1].fileName : null;

      return {
        files,
        nextFileName,
      };
    })
    .catch((err) => {
      console.error('Ошибка при получении списка файлов:', err);
    });
};
