import { Router } from "express";
import {
  getAllAlumni,
  getAlumni,
  getAlumniDocs,
  getCertificate,
} from "../dbQueries";
import routersAuth from "./routesAuth";
import { checkAuth } from "../middlewares";

const api = Router();

// /api
api.get("/", (req, res) => {
  res.end("The API is up and running :)");
});

api.use(routersAuth);

// ==============================================
// ==> Admin role endpoints
// ==============================================

api.get("/alumni", checkAuth, (req, res) => {
  if (req.user?.role !== "admin") {
    res.statusCode = 401;
    res.json({ msg: "Unauthorized" });
    return;
  }
  const allAlumni = getAllAlumni();
  return res.json({ data: allAlumni });
});

api.get("/alumni/:studentnum", checkAuth, (req, res) => {
  if (req.user?.role !== "admin") {
    res.statusCode = 401;
    res.json({ msg: "Unauthorized" });
    return;
  }
  const studentnum = parseInt(req.params.studentnum);
  if (isNaN(studentnum)) {
    res.statusCode = 400;
    res.json({ error: { msg: "Invalid student number!" } });
    return;
  }
  const allAlumni = getAlumni(studentnum);
  return res.json({ data: allAlumni });
});

api.get("/alumni/:studentnum/docs", checkAuth, (req, res) => {
  if (req.user?.role !== "admin") {
    res.statusCode = 401;
    res.json({ msg: "Unauthorized" });
    return;
  }
  const studentnum = parseInt(req.params.studentnum);
  if (isNaN(studentnum)) {
    res.statusCode = 400;
    res.json({ error: { msg: "Invalid student number!" } });
    return;
  }
  if (req.user.role === "admin") {
    const docs = getAlumniDocs(studentnum);
    res.json({ data: docs });
  } else {
    res.statusCode = 500;
    return res.json({
      error: {
        msg: "Something wrong happend!",
      },
    });
  }
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
