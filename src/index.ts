import clrs from 'colors';
import * as config from './config';
import * as database from './database';
import * as server from './server';

// Check config, Connect database, Run server, Enjoy.
config
  .check()
  .then(database.connect)
  .then(server.run)
  .then(() => console.info(clrs.green('🕹  Enjoy! 😚')))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
