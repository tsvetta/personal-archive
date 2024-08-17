import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import os from 'os';

const homeDirectory = os.homedir();
const inputFolder = path.join(homeDirectory, 'Downloads', 'archive');
const outputFolder = path.join(homeDirectory, 'Downloads', 'archive');
const thumbnailSuffix = '_thumb'; // Суффикс для имени мини-превью

// Функция для рекурсивного обхода всех папок и файлов
async function processDirectory(directory: string) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    const fileExt = path.extname(file).toLowerCase();

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
      // обработка только картинок
    } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(fileExt)) {
      const fileName = path.basename(file, fileExt).replace('.JPG', ''); // Имя файла без расширения
      const originalFilePathWebp = path.join(directory, `${fileName}.webp`);

      const isPreview = fileName.includes(thumbnailSuffix);
      const isWebp = fileExt === '.webp';

      const previewFilePath = path.join(
        directory,
        `${fileName}${thumbnailSuffix}.webp`
      );

      try {
        // Конвертация в WebP, если такого webp еще нет
        if (!isWebp && !fs.existsSync(originalFilePathWebp)) {
          await sharp(fullPath).toFormat('webp').toFile(originalFilePathWebp);
          console.log(`Converted ${fullPath} to WebP format successfully.`);
        }

        // Cоздание превью, если такого превью еще нет
        if (!isPreview && !fs.existsSync(previewFilePath)) {
          await sharp(fullPath).resize(100, 100).toFile(previewFilePath);
          console.log(`\nThumbnail for ${fullPath} created successfully.`);
        }

        // Удаление файла, если это не webp
        if (!isWebp) {
          fs.unlinkSync(fullPath);
          console.log(`Delete ${fullPath}.`);
        }

        // Удаление оригинального файла, если в названии есть .JPG
        if (fullPath.includes('.JPG')) {
          fs.unlinkSync(fullPath);
          console.log(`Delete ${fullPath}.`);
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  }
}

// Создание папки output, если она не существует
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Запуск генерации мини-превью
processDirectory(inputFolder)
  .then(() => console.log('Thumbnails generated successfully.'))
  .catch((error) => console.error('Error generating thumbnails:', error));
