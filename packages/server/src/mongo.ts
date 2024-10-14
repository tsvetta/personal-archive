import 'dotenv/config';
import mongoose from 'mongoose';
import { dbURI } from '@archive/common/environment.js';

export const connectMongoDB = () => {
  mongoose.connect(dbURI).catch((err) => {
    console.error(err);
  });

  const db = mongoose.connection;

  db.once('open', () => {
    console.log('Connected to MongoDB. Host:', db.host);
  });

  db.on('close', () => {
    console.log('Connection to MongoDB closed');
  });
};

export const saveJsonToNewCollection = async (
  collectionName: string,
  jsonData: any
) => {
  try {
    // Создание динамической схемы на основе JSON
    const dynamicSchema = new mongoose.Schema({}, { strict: false });

    // Создание модели с динамической схемой
    const DynamicModel = mongoose.model(
      collectionName,
      dynamicSchema,
      collectionName
    );

    await DynamicModel.deleteMany({});
    console.log('All documents deleted from collection:', collectionName);

    // Создание и сохранение нового документа
    await DynamicModel.insertMany(jsonData);

    console.log('Document inserted into new collection:', collectionName);
  } catch (error) {
    console.error('Error inserting document:', error);
  }
};
