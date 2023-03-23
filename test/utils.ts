import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  const mongoServer = await MongoMemoryServer.create();
  mongoose.set('strictQuery', false);
  await mongoose.connect(mongoServer.getUri(), {
    dbName: 'testing',
  });
};

export const disconnectFromDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
};
