import { Router } from "express";
import { getCertificate } from "../dbQueries";

const api = Router();

// /api
api.get("/", (req, res) => {
  res.end("The API is up and running :)");
});

api.post("/register", (req, res) => {
  res.end("/api/register route is working!");
});

api.post("/login", (req, res) => {
  res.end("/api/login route is working!");
});

api.post("/verify", (req, res) => {
  console.log("/api/verify route is working!");
  const { lName, certID } = req.body;
  // TODO: verify certificate id and name
  // ...
  // ...

  // run SQL query
  const certificate = getCertificate(lName, certID);

  // if the require is found, send it to the client
  if (certificate) res.json(certificate);
  // otherwise, send an error message
  else {
    res.statusCode = 404;
    res.json({ error: { msg: "Certificate not found!" } });
  }
});

export default api;
