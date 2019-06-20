import http from 'http';
import clrs from 'colors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bearerToken from 'express-bearer-token';
import { errorHandler } from './middlewares';
import routes from './routes';

const app = express();

const logger =
  app.get('env') === 'development'
    ? morgan('dev')
    : morgan('combined', {
        skip: (req, res) => res.statusCode < 500
      });

app.use(logger);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cors());
app.use(helmet());
app.use(bearerToken());
app.use(routes);
app.use(errorHandler);

export async function run() {
  return new Promise<http.Server>((resolve, reject) => {
    const port = process.env.PORT || 5000;
    const server = app.listen(port);

    server.once('listening', () => {
      console.info(
        clrs.green(`🤟 Server is listening at port ${clrs.yellow(port + '')}`)
      );
      resolve(server);
    });

    server.once('error', err => {
      console.error(
        clrs.red(`🤔 Server failed to listen at ${clrs.yellow(port + '')}`)
      );
      reject(err);
    });
  });
}
