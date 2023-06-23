import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import session from "express-session";
import passport from "passport";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { mongoManager } from "@switchfeat/core";
import * as flagsRoutes from "./routes/flagsRoutes";

dotenv.config();

var env = process.env.NODE_ENV;

// connect to mongodb
mongoManager.connectDB();
 
const app: Express = express();
const port = process.env.PORT || 4000;

app.use(cookieParser());

// used for post requests
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "$%£$£DDikdjflieas93mdjk.sldcpes",
}));
app.use(passport.initialize());
app.use(passport.session());

// set up cors to allow us to accept requests from our client
 
  app.use(
    cors({
      origin: env !== "http://localhost:3000",  
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true // allow session cookie from browser to pass through
    }));

// Have Node serve the files for our built React app
if (env !== "dev") {
  app.use(express.static(path.resolve(__dirname, '../../client')));
}


// app.use(authRoutes);
app.use("/api/flags", () => flagsRoutes);

// All other GET requests not handled before will return our React app
if (env !== "dev") {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port} , env: ${env}`);
});
