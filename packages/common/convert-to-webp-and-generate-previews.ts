import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import os from 'os';

const homeDirectory = os.homedir();
const inputFolder = path.join(homeDirectory, 'Downloads', 'archive');
const outputFolder = path.join(homeDirectory, 'Downloads', 'archive');
const thumbnailSuffix = '_thumb'; // Суффикс для имени мини-превью

const convertToWebp = async (directory: string, file: string) => {
  const fullPath = path.join(directory, file);
  const fileExt = path.extname(file).toLowerCase();
  const fileName = path.basename(file, fileExt).replace('.JPG', ''); // Имя файла без расширения
  const originalFilePathWebp = path.join(directory, `${fileName}.webp`);
  const isWebp = fileExt === '.webp';

  if (!isWebp && !fs.existsSync(originalFilePathWebp)) {
    await sharp(fullPath).toFormat('webp').toFile(originalFilePathWebp);
    console.log(`Converted ${fullPath} to WebP format successfully.`);
  }
};

const generatePreview = async (directory: string, file: string) => {
  const fullPath = path.join(directory, file);
  const fileExt = path.extname(file).toLowerCase();
  const fileName = path.basename(file, fileExt).replace('.JPG', '');
  const isPreview = fileName.includes(thumbnailSuffix);

  const previewFilePath = path.join(
    directory,
    `${fileName}${thumbnailSuffix}.webp`
  );

  if (!isPreview && !fs.existsSync(previewFilePath)) {
    await sharp(fullPath).resize(100, 100).toFile(previewFilePath);
    console.log(`\nThumbnail for ${fullPath} created successfully.`);
  }
};

const deleteOriginalFile = async (directory: string, file: string) => {
  const fullPath = path.join(directory, file);
  const fileExt = path.extname(file).toLowerCase();
  const isWebp = fileExt === '.webp';

  if (!isWebp) {
    fs.unlinkSync(fullPath);
    console.log(`Delete ${fullPath}.`);
  }

  // Удаление оригинального файла, если в названии есть .JPG
  if (fullPath.includes('.JPG')) {
    fs.unlinkSync(fullPath);
    console.log(`Delete ${fullPath}.`);
  }
};

// Функция для рекурсивного обхода всех папок и файлов
async function processDirectory(directory: string) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    const fileExt = path.extname(file).toLowerCase();

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(fileExt)) {
      try {
        await convertToWebp(directory, file);
        await generatePreview(directory, file);
        await deleteOriginalFile(directory, file);
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
