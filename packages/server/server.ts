// import express from 'express';
import 'dotenv/config';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';

import { schema } from './schema.js';
import { resolvers } from './resolvers.js';

// const dbURI = `mongodb+srv://${process.env.MongoLogin}:${process.env.MongoPass}@cluster0.ie3yjvk.mongodb.net/tsvetta-archive`;
const dbURI = process.env.MongoURI || '';
mongoose.connect(dbURI).catch((err) => {
  console.error(err);
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB. Host:', db.host);
});

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log('Server ready at', url);

// import common from '@archive/common';
// common();
