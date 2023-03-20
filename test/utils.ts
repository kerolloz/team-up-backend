import mongoose from 'mongoose';

const mongoTestDatabase = 'mongodb://localhost:27017/myapp_test';

export const connectToDatabase = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(mongoTestDatabase);
};

export const disconnectFromDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
};
