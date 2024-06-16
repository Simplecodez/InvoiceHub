import { Server } from 'http';
import { Server as httpsServer } from 'https';
import 'dotenv/config';
import 'reflect-metadata';
import './diinjection/di.injection';
import MongoDBConnection from './configs/db.configs';
import { app } from './app';

const mongoDBConnection = new MongoDBConnection(process.env.MONGO_URI as string);

let server: Server | httpsServer;
const port = process.env.PORT;

mongoDBConnection
  .connect()
  .then(() => {
    console.log('Connected to Database!!!');
    server = app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
