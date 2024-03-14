import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { NextFunction, Request, Response } from "express";
import { getEnvironmentVariables } from "./environments/environment";
import UserRouter from "./routers/UserRouter";

export class Server {
  public app: express.Application = express();

  constructor() {
    this.setConfigs();
    this.setRoutes();
    this.error404Handler();
    this.handlerErrors();
  }

  setConfigs() {
    this.connectMongoDb();
    this.configureBodyParser();
    this.allowCors();
  }

  connectMongoDb() {
    mongoose.connect(getEnvironmentVariables().db_uri).then(() => {
      console.log("Connected to mongodb");
    });
  }

  configureBodyParser() {
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
  }

  allowCors() {
    this.app.use(cors());
  }

  setRoutes() {
    this.app.use("/api/user", UserRouter);
  }

  error404Handler() {
    this.app.use((req, res) => {
      res.status(404).json({
        message: "Not Found",
        status_code: 404,
      });
    });
  }

  handlerErrors() {
    this.app.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        const errorStatus = (req as any).errorStatus || 500;
        res.status(errorStatus).json({
          message: error.message || "Something went wrong, Please try again!",
          status_code: errorStatus,
        });
      }
    );
  }
}
