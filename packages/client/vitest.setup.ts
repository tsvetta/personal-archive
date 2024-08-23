import '@testing-library/jest-dom/vitest';
import '@testing-library/react/dont-cleanup-after-each';
import dotenv from 'dotenv';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { cleanupAfterAll } from './src/tests/helpers/cleanup.js';

// Before run: create .env.test !
dotenv.config({ path: '.env.test' });

let mongoServer: MongoMemoryReplSet;

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create();

  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
}, 120000);

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();

  await cleanupAfterAll.cleanup();
});
