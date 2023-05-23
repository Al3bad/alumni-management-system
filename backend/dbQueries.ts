import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import db from "./db";

// ==============================================
// ==> Interfaces
// ==============================================
interface Alumni {
  studentNum: number; // {PK}
  fName: string;
  lName: string;
  email: string;
  password: string;
  salt: string;
}

interface Certificate {
  id: number; // {PK}
  issueDate: string;
  studentNum: number; // {FK}
}

interface CertificateData {
  alumniName: string;
  certID: string;
  issueDate: string;
}

// ==============================================
// ==> Init DB
// ==============================================

export const createUserTable = () => {
  try {
    const stmt = db.prepare(`CREATE TABLE IF NOT EXISTS user (
                                id INTEGER PRIMARY KEY,
                                fname TEXT NOT NULL,
                                lname TEXT NOT NULL,
                                email TEXT NOT NULL,
                                mobile TEXT NOT NULL,
                                password TEXT NOT NULL,
                                salt TEXT NOT NULL,
                                role TEXT NOT NULL
                            )`);
    const info = stmt.run();
    console.log(info);
  } catch (err) {
    console.log("[ERROR] createUserTable function!");
  }
};

export const createDocumentTable = () => {
  try {
    const stmt = db.prepare(`CREATE TABLE IF NOT EXISTS document (
                                id INTEGER NOT NULL UNIQUE PRIMARY KEY,
                                type TEXT NOT NULL,
                                issuedate TEXT NOT NULL,
                                studentnum INTEGER,
                                FOREIGN KEY (studentnum) REFERENCES user(id)
                            )`);
    const info = stmt.run();
    console.log(info);
  } catch (err) {
    console.log("[ERROR] createCertificateTable function!");
  }
};

// ==============================================
// ==> Search User Queries
// ==============================================
// Get user by either email or id
export const getUser = (value: number | string) => {
  let attribute = "id";
  if (typeof value === "string") attribute = "email";
  try {
    const stmt = db.prepare(
      `SELECT id, email, fname, lname, role FROM user WHERE ${attribute} = ?`
    );
    const user = stmt.get(value);
    return user;
  } catch (err) {
    console.log(err);
  }
};

// ==============================================
// ==> Alumni Queries
// ==============================================
export const insertAdmin = ({
  id,
  fname,
  lname,
  email,
  mobile,
  password,
  salt,
}: {
  id: number;
  fname: string;
  lname: string;
  email: string;
  mobile: string;
  password: string;
  salt: string;
}) => {
  try {
    const query = `
      INSERT INTO user
        (id, fname, lname, email, mobile, password, salt, role)
      VALUES
        (?,?,?,?,?,?,?,?)`;
    // Insert new alumni
    const info = db
      .prepare(query)
      .run(id, fname, lname, email, mobile, password, salt, "admin");
    return info;
  } catch (err) {
    console.log(err);
  }
};

export const getAllAlumni = () => {
  try {
    const stmt = db.prepare(
      `SELECT id, fname, lname, TYPEOF(email) == 'text' AS is_registered FROM user WHERE role = 'student'`
    );
    const allAlumni = stmt.all();
    return allAlumni;
  } catch (err) {
    console.log(err);
  }
};

export const getAlumni = (studentnum: number) => {
  try {
    const stmt = db.prepare(
      `SELECT id, fname, lname, email, mobile, TYPEOF(email) == 'text' AS is_registered FROM user WHERE role = 'student' AND id = ?`
    );
    const allAlumni = stmt.get(studentnum);
    return allAlumni;
  } catch (err) {
    console.log(err);
  }
};

export const getAlumniDetails = (studentnum: number) => {
  try {
    const stmt = db.prepare(`
                    SELECT d.id, d.type, d.issuedate
                    FROM user u
                    JOIN document d
                        ON u.id = d.studentnum
                    WHERE u.id = ?`);
    const alumniDetails = stmt.all(studentnum);
    return alumniDetails;
  } catch (err) {
    console.log(err);
  }
};

// ==============================================
// ==> Alumni Queries
// ==============================================

export const getAlumniDocs = (studentnum: number) => {
  try {
    const stmt = db.prepare(
      `
      SELECT SUBSTR(strftime('%Y', d.issuedate), 3) || PRINTF('%07d',d.id)
            AS "docID",
          d.type
            AS "docType",
          d.issuedate
            AS "issueDate",
          '/pdf/'|| SUBSTR(strftime('%Y', d.issuedate), 3) || PRINTF('%07d',d.id) || '.pdf'
            AS "link"
      FROM document d
      JOIN user u
          ON d.studentnum = u.id
      WHERE u.id = ?;
      `
    );
    const docs = stmt.all(studentnum);
    return docs;
  } catch (err) {
    console.log(err);
  }
};

// Insert new alumni
export const insertAlumniWithCert = ({
  studentnum,
  fname,
  lname,
}: {
  studentnum: number;
  fname: string;
  lname: string;
}) => {
  try {
    const query = `
      INSERT INTO user
        (id, fname, lname, role)
      VALUES
        (?,?,?,?)`;
    const query2 = `
      INSERT INTO document
        (type, issuedate, studentnum)
      VALUES
        ('certificate', DATE(CURRENT_DATE), ?)`;
    let info: any = {};
    db.transaction((_) => {
      // Insert new alumni
      info.newAlumniInfo = db
        .prepare(query)
        .run(studentnum, fname, lname, "student");
      // Insert new certificate
      info.newCertInfo = db.prepare(query2).run(studentnum);
    })([{}]);

    const certData: any = db
      .prepare(
        `SELECT  SUBSTR(strftime('%Y', d.issuedate), 3) || PRINTF('%07d',d.id)
            AS "certID",
            u.fname,
            u.lname,
            STRFTIME('%d/%m/%Y', d.issuedate)
                AS "issuedate"
            FROM user u
            JOIN document d
                ON u.id = d.studentnum
            WHERE u.id = ? AND d.id = ?`
      )
      .get(
        info.newAlumniInfo.lastInsertRowid,
        info.newCertInfo.lastInsertRowid
      );

    const pdfDir = path.join(__dirname, "..", "static", "pdf");
    console.log(pdfDir);
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(fs.createWriteStream(`${pdfDir}/${certData.certID}.pdf`));
    doc
      .fontSize(12)
      .text(`Name: ${certData.fname} ${certData.lname}`)
      .text(`Degree: ${"Engineering"}`)
      .text(`Issue Date: ${certData.issuedate}`)
      .text(`Certificate ID: ${certData.certID}`);
    doc.end();

    return certData;
  } catch (err) {
    console.log(err);
  }
};

// Register new alumni
export const registerAlumni = ({
  studentnum,
  email,
  mobile,
  password,
  salt,
}: {
  studentnum: number;
  email: string;
  mobile: string;
  password: string;
  salt: string;
}) => {
  try {
    const query = `
      UPDATE user
      SET email = ?, mobile = ?, password = ?, salt = ?
      WHERE id = ?`;
    const stmt = db.prepare(query);
    const info = stmt.run(email, mobile, password, salt, studentnum);
    return info;
  } catch (err) {
    console.log(err);
  }
};

// TODO: Move logic for "Getting alumni record" from passport straticty block to here

// ==============================================
// ==> Certificate Queries
// ==============================================

// Insert new certificate (by admin)
export const insertCertificate = (studentnum: number) => {
  try {
    // TODO:
    const stmt = db.prepare(
      `INSERT INTO certificate (issuedate, studentnum) VALUES (DATE(CURRENT_DATE), ?)`
    );
    const info = stmt.run(studentnum);
    return info;
  } catch (err) {
    console.log(`[ERROR] insert Certificate function`);
  }
};

// Get user id that owns a certificate filename (for download)
export const getStudentnumByCertFilename = (certFile: string) => {
  try {
    const stmt = db.prepare(`
                            SELECT
                                u.id AS "studentnum",
                                SUBSTR(strftime('%Y', d.issuedate), 3) || PRINTF('%07d',d.id) || '.pdf'
                                    AS "certFile"
                            FROM document d
                            JOIN user u
                                ON d.studentnum = u.id
                            WHERE "certFile" = ?;
                          `);
    const record = stmt.get(certFile);
    return record;
  } catch (err) {
    console.log(`[ERROR] getStudentnumByCertFilename function`);
    console.log(err);
  }
};

// Get certificate record (for external users)
export const getCertificate = (certID: string) => {
  try {
    const stmt = db.prepare(`
                            SELECT
                                u.fname, u.lname,
                                SUBSTR(strftime('%Y', d.issuedate), 3) || PRINTF('%07d',d.id)
                                    AS "certID",
                                STRFTIME('%d/%m/%Y', d.issuedate)
                                    AS "issuedate"
                            FROM document d
                            JOIN user u
                                ON d.studentnum = u.id
                            AND "certID" = ?
                          `);
    const certificate = stmt.get(certID);
    return certificate;
  } catch (err) {
    console.log(`[ERROR] getCertificate function`);
    console.log(err);
  }
};
