import path from "path";
import fs from "fs";
import { Router } from "express";
import {
  getAllAlumni,
  getAlumni,
  getAlumniDocs,
  getCertificate,
  getUser,
} from "../dbQueries";
import routersAuth from "./routesAuth";
import { checkAuth } from "../middlewares";
import {
  insertAlumniWithCert,
  getStudentnumByCertFilename,
} from "../dbQueries";
import {
  addNewAlumniFormValidationSchema,
  verifyCertFormValidationSchema,
} from "./../../common/validation";

const api = Router();

// /api
api.get("/", (req, res) => {
  res.end("The API is up and running :)");
});

api.use(routersAuth);

// ==============================================
// ==> Download certificate files
// ==============================================
api.get("/pdf/:certFile", checkAuth, (req, res) => {
  const filePath = path.resolve(
    __dirname,
    "..",
    "..",
    "static",
    "pdf",
    req.params.certFile
  );
  if (req.user?.role === "student") {
    const record: any = getStudentnumByCertFilename(req.params.certFile);
    if (!record) {
      res.statusCode = 404;
      return res.json({
        error: {
          msg: "Document not found!",
        },
      });
    }
    if (record?.studentnum !== req.user?.id) {
      res.statusCode = 401;
      return res.json({
        error: {
          msg: "Unauthorised!",
        },
      });
    }
    res.statusCode = 200;
    res.contentType("pdf");
    res.sendFile(filePath);
  } else if (req.user?.role === "admin") {
    const doesExists = fs.existsSync(filePath);
    if (doesExists) {
      res.statusCode = 200;
      res.contentType("pdf");
      res.sendFile(filePath);
    } else {
      res.statusCode = 404;
      return res.json({
        error: {
          msg: "File not found!",
        },
      });
    }
  } else {
    res.statusCode = 401;
    return res.json({
      error: {
        msg: "Unauthorised!",
      },
    });
  }
});

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

api.post("/alumni", checkAuth, async (req, res) => {
  if (req.user?.role !== "admin") {
    res.statusCode = 401;
    res.json({ msg: "Unauthorized" });
    return;
  }

  const isValid = await addNewAlumniFormValidationSchema.isValid(req.body);
  if (!isValid) {
    res.statusCode = 400;
    return res.json({
      error: {
        msg: "Provided form data is invalid!",
      },
    });
  }

  const { studentID, fname, lname } = req.body;
  const studentnum = parseInt(studentID.slice(1));

  const alumniUser: any = getUser(studentnum);
  if (alumniUser) {
    res.statusCode = 400;
    return res.json({
      error: {
        msg: "There is already exiting record for this alumni!",
      },
    });
  }
  const certData: any = insertAlumniWithCert({ studentnum, fname, lname });
  // Create the certificate document
  res.statusCode = 201;
  return res.json({ data: "A new alumni was sucessfully created!" });
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

// ==============================================
// ==> Verify certificates for external users
// ==============================================

api.post("/verify", async (req, res) => {
  const { certID } = req.body;

  const isValid = await verifyCertFormValidationSchema.isValid(req.body);
  if (!isValid) {
    res.statusCode = 400;
    return res.json({
      error: {
        msg: "Please provide the certificate ID!",
      },
    });
  }

  // run SQL query
  const certificate = getCertificate(certID);

  // if the require is found, send it to the client
  if (certificate) res.json({ data: certificate });
  // otherwise, send an error message
  else {
    res.statusCode = 404;
    res.json({ error: { msg: "Certificate not found!" } });
  }
});

export default api;
