import 'dotenv/config';
import mongoose from 'mongoose';

const dbURI = process.env.MongoURI || '';

export const connectMongoDB = () => {
  mongoose.connect(dbURI).catch((err) => {
    console.error(err);
  });

  const db = mongoose.connection;

  db.once('open', () => {
    console.log('Connected to MongoDB. Host:', db.host);
  });
};
