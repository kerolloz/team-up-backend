import http from 'http'; // TODO add https
import colors from 'colors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { exceptionHandler } from './middlewares';

const { NODE_ENV, PORT } = process.env;
const app = express();

// [TODO] use winston
const logger =
  NODE_ENV === 'development'
    ? morgan('dev')
    : morgan('combined', {
        skip: (_, res) => res.statusCode < 500,
      });

app.use(logger);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cors());
app.use(helmet());
app.use(routes);
app.use(exceptionHandler);

export function run(): Promise<http.Server> {
  return new Promise<http.Server>((resolve, reject) => {
    const port = PORT || 5000;
    const server = app.listen(port);

    server.once('listening', () => {
      console.info(
        colors.green(`Server is listening on port ${colors.yellow(port + '')}`),
      );
      resolve(server);
    });

    server.once('error', (err) => {
      console.error(
        colors.red(
          `Server failed to listen on port ${colors.yellow(port + '')}`,
        ),
      );
      reject(err);
    });
  });
}
