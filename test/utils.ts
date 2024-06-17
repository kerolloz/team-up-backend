import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

export const connectToDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoose.set('strictQuery', false);
  await mongoose.connect(mongoServer.getUri(), {
    dbName: 'testing',
  });
};

export const disconnectFromDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
};
