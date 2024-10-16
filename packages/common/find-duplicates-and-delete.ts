// import fs from 'fs';
import path from 'path';
import os from 'os';
import { imageHash } from 'image-hash';
import resemble from 'resemblejs';
import fs from 'fs-extra';

const allowedExtensions = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.bmp',
  '.tiff',
];

function hashImage(filePath) {
  return new Promise((resolve, reject) => {
    imageHash(filePath, 16, true, (error, data) => {
      if (error) reject(error);
      resolve(data); // Возвращаем хеш изображения
    });
  });
}

// Функция для проверки, является ли файл изображением
function isImage(file) {
  const ext = path.extname(file).toLowerCase();
  return allowedExtensions.includes(ext);
}

function compareImages(image1, image2) {
  return new Promise((resolve, reject) => {
    resemble(image1)
      .compareTo(image2)
      .ignoreColors() // Игнорируем цвета для более точного сравнения
      .onComplete((data) => {
        resolve(data.misMatchPercentage); // Процент несоответствия
      });
  });
}

async function findDuplicates(directory) {
  const hashes = {}; // Объект для хранения хешей файлов

  async function processDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.lstatSync(itemPath);

      if (stat.isDirectory()) {
        // Если это директория, вызываем функцию рекурсивно
        await processDirectory(itemPath);
      } else if (isImage(item)) {
        // Если это файл изображения, обрабатываем его
        try {
          const hash: any = await hashImage(itemPath);

          // Проверяем наличие дубликатов
          if (hashes[hash]) {
            console.log(`Duplicate found: ${itemPath} and ${hashes[hash]}`);

            // Удаляем дубликат
            // fs.unlink(itemPath, (err) => {
            //   if (err) throw err;
            //   console.log(`Deleted duplicate file: ${itemPath}`);
            // });
          } else {
            hashes[hash] = itemPath; // Сохраняем хеш и путь к оригиналу
          }
        } catch (error) {
          console.error(`Error processing file ${itemPath}:`, error);
        }
      } else {
        console.log(`Skipping non-image file: ${item}`);
      }
    }
  }

  // Начинаем обработку с корневой директории
  await processDirectory(directory);
}

// async function findDuplicates(directory) {
//   const imageFiles: any = [];

//   // Рекурсивная функция для обработки всех файлов и папок
//   async function collectImages(dir) {
//     const items = await fs.readdir(dir);

//     for (const item of items) {
//       const itemPath = path.join(dir, item);
//       const stat = await fs.lstat(itemPath);

//       if (stat.isDirectory()) {
//         // Если это директория, вызываем функцию рекурсивно
//         await collectImages(itemPath);
//       } else if (isImage(item)) {
//         // Если это файл изображения, добавляем его в список
//         imageFiles.push(itemPath);
//       }
//     }
//   }

//   // Сбор всех изображений в директории и подпапках
//   await collectImages(directory);

//   const duplicates: any = [];

//   // Сравнение каждого изображения с другими
//   for (let i = 0; i < imageFiles.length; i++) {
//     for (let j = i + 1; j < imageFiles.length; j++) {
//       const image1 = imageFiles[i];
//       const image2 = imageFiles[j];

//       const diff: any = await compareImages(image1, image2);

//       if (diff < 1) {
//         // Если изображения схожи более чем на 99%
//         console.log(`Duplicate found: ${image1} and ${image2}`);
//         duplicates.push(image2);
//       }
//     }
//   }

//   console.log(duplicates);

//   // Удаляем найденные дубликаты
//   // duplicates.forEach((filePath) => {
//   //   fs.unlink(filePath, (err) => {
//   //     if (err) throw err;
//   //     console.log(`Deleted duplicate file: ${filePath}`);
//   //   });
//   // });
// }

const homeDirectory = os.homedir();
const inputFolder = path.join(homeDirectory, 'Downloads', 'archive');

findDuplicates(inputFolder);
