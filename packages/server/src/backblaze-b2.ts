import 'dotenv/config';
import B2 from 'backblaze-b2';

const applicationKeyId = process.env.BB_Id || '';
const applicationKey = process.env.BB_Key || '';
const bucketId = process.env.BB_Bucket_Id || '';
const bbCDNUrl = process.env.CDN_URL || '';

export const getBBCDNPhotos = (
  maxFileCount?: number,
  startFileName?: string
) => {
  const b2 = new B2({
    applicationKeyId,
    applicationKey,
  });

  return b2
    .authorize()
    .then(() => {
      return b2.listFileNames({
        bucketId,
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
