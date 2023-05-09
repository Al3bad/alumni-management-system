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
import api from "./backend/api";
import { createAlumniTable, createCertificateTable } from "./backend/dbQueries";

// ==============================================
// ==> Prepare App
// ==============================================
const port = process.env.SERVER_PORT || 3000;
const app = express();
app.disable("x-powered-by");

// ==============================================
// ==> Middlewares
// ==============================================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  // reference: https://stackoverflow.com/a/7069902
  if (process.env.NODE_ENV !== "production") {
    res.header("Access-Control-Allow-Origin", [
      process.env.DOMAIN_URL || "http://localhost:5173",
    ]);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ]);
    res.header("Access-Control-Allow-Headers", ["Content-Type"]);
  }
  next();
});

// ==============================================
// ==> Frontend Routes
// ==============================================
// app.use(express.static(`${__dirname}/dist`));
// app.get("/", (req, res) => {
//   res.sendFile(`${__dirname}/dist/index.html`);
// });

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
  createAlumniTable();
  createCertificateTable();
  console.log(
    `Server is running on port ${port} in ${
      process.env.NODE_ENV || "development"
    } enviroment`
  );
});
