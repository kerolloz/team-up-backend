import colors from 'colors';
import { mongoose } from '@typegoose/typegoose';

export async function connect(): Promise<void> {
  const { MONGODB_URI = '' } = process.env;

  try {
    await mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.info(
      colors.green(`Successfully connected to ${colors.yellow(MONGODB_URI)}`),
    );
  } catch (err) {
    console.error(
      colors.red(`Failed to connect to ${colors.yellow(MONGODB_URI)}`),
    );
    throw err;
  }
}
