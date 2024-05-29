import "dotenv/config";
import "reflect-metadata";
import MongoDBConnection from "./configs/db.configs";
import { app } from "./app";
import { Server } from "http";
import { Server as httpsServer } from "https";

const mongoDBConnection = new MongoDBConnection(
  process.env.MONGO_URI as string
);

let server: Server | httpsServer;

mongoDBConnection
  .connect()
  .then(() => {
    console.log("Connected to Database!!!");
    server = app.listen(3000, () => {
      console.log('App listening on port "3000"');
    });
  })
  .catch((err) => {
    console.log(err);
  });
