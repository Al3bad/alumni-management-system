// ==============================================
// ==> Prepare Env
// ==============================================
import dotenv from "dotenv";
if (process.env.NODE_ENV === "production") {
  console.log("Running in production enviroment");
  dotenv.config({ path: `${__dirname}/.env.production` });
} else {
  console.log("Running in development enviroment");
  dotenv.config({ path: `${__dirname}/.env.development` });
}

// ==============================================
// ==> Import Modules
// ==============================================
import express from "express";
import passport from "passport";
import api from "./backend/api";
import { cors, session } from "./backend/middlewares";
import { createUserTable, createDocumentTable } from "./backend/dbQueries";

// ==============================================
// ==> Prepare App
// ==============================================
const port = process.env.SERVER_PORT || 3000;
const app = express();
app.disable("x-powered-by");

// ==============================================
// ==> Middlewares
// ==============================================
// parse json and urlencoded bodies in the request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// configure sessions
app.use(session());
app.use(passport.session());
// configure CORS
app.use(cors);

// ==============================================
// ==> Frontend Routes
// ==============================================
app.use(express.static(`${__dirname}/dist`));
app.get("/", (_, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

// ==============================================
// ==> API Routes
// ==============================================
app.use("/api", api);

// ==============================================
// ==> Start Listening
// ==============================================
app.listen(port, async () => {
  // if (process.env.NODE_ENV === "production") {
  //   await initDB();
  // } else {
  //   await resetDB();
  //   seedDB();
  // }
  createUserTable();
  createDocumentTable();
  console.log(
    `Server is running on port ${port} in ${
      process.env.NODE_ENV || "development"
    } enviroment`
  );
});
