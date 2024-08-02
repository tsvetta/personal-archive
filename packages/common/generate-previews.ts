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

    if (stat.isDirectory()) {
      // Если это папка, рекурсивно обрабатывать её содержимое
      await processDirectory(fullPath);
    } else if (
      ['.jpg', '.jpeg', '.png', '.webp'].includes(
        path.extname(file).toLowerCase()
      )
    ) {
      // Если это изображение, обрабатывать его
      const fileName = path.basename(file, path.extname(file)); // Имя файла без расширения
      const outputFilePath = path.join(
        directory,
        `${fileName}${thumbnailSuffix}${path.extname(file)}`
      );

      try {
        await sharp(fullPath)
          .resize(100, 100) // Размер мини-превью 100x100 пикселей
          .toFile(outputFilePath);
        console.log(`Thumbnail for ${fullPath} created successfully.`);
      } catch (error) {
        console.error(`Error processing file ${fullPath}:`, error);
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
