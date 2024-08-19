import '@testing-library/jest-dom/vitest';
import '@testing-library/react/dont-cleanup-after-each';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Before run: create .env.test !
dotenv.config({ path: '.env.test' });

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  const uri = mongoServer.getUri();
  const db = mongoose.connection;

  db.once('open', () => {
    console.log('Connected to Test MongoDB. Host:', db.host);
  });

  db.on('close', () => {
    console.log('Connection to Test MongoDB closed');
  });

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});
