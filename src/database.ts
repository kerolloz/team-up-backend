import clrs from 'colors';
import mongoose from 'mongoose';

export async function connect() {
  const mongoURL: string | undefined = process.env.MONGODB_URL;
  if (!mongoURL) {
    const errMsg = clrs.red(
      `🤨 ${clrs.yellow('MONGODB_URL').bold} environment variable was not set`
    );
    throw new Error(errMsg);
  }

  try {
    const connection = await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.info(
      clrs.green(`🤟 Successfully connected to ${clrs.yellow(mongoURL)}`)
    );
    return connection;
  } catch (err) {
    console.error(clrs.red(`🤔 Failed to connect to ${clrs.yellow(mongoURL)}`));
    throw err;
  }
}
