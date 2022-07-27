import colors from 'colors';
import mongoose from 'mongoose';
import { mongoURIEnvVar } from './config';

export async function connect(): Promise<void> {
  try {
    await mongoose.connect(mongoURIEnvVar);

    console.info(colors.green('Successfully connected to Mongodb ✅'));
  } catch (err) {
    console.error(
      colors.red(`Failed to connect to ${colors.yellow(mongoURIEnvVar)}`),
    );
    throw err;
  }
}
