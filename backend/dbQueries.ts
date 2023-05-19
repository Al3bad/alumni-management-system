import fs from "node:fs/promises";
import crypto from "node:crypto";
import db from "./db";

const backendDir = `${__dirname}`;

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
export const createAlumniTable = () => {
  try {
    const stmt = db.prepare(`CREATE TABLE IF NOT EXISTS alumni (
                                studentnum INTEGER PRIMARY KEY,
                                fname TEXT NOT NULL,
                                lname TEXT NOT NULL,
                                email TEXT,
                                password TEXT,
                                salt TEXT
                            )`);
    const info = stmt.run();
    console.log(info);
  } catch (err) {
    console.log("[ERROR] createAlumniTable function!");
  }
};

export const createCertificateTable = () => {
  try {
    const stmt = db.prepare(`CREATE TABLE IF NOT EXISTS certificate (
                                id INTEGER NOT NULL UNIQUE PRIMARY KEY,
                                issuedate TEXT NOT NULL,
                                studentnum INTEGER,
                                FOREIGN KEY (studentnum) REFERENCES alumni(studentnum)
                            )`);
    const info = stmt.run();
    console.log(info);
  } catch (err) {
    console.log("[ERROR] createCertificateTable function!");
  }
};

// ==============================================
// ==> Alumni Queries
// ==============================================

// Get user by studentnum
export const getUserByStudentNum = (studentnum: number) => {
  try {
    const stmt = db.prepare(
      "SELECT studentnum, email, fname, lname FROM alumni WHERE studentnum = ?"
    );
    const user = stmt.get(studentnum);
    return user;
  } catch (err) {
    console.log(err);
  }
};

// Get user by email
export const getUserByEmail = (email: string) => {
  try {
    const stmt = db.prepare(
      "SELECT studentnum, email, fname, lname FROM alumni WHERE email = ?"
    );
    const user = stmt.get(email);
    return user;
  } catch (err) {
    console.log(err);
  }
};

// Insert new alumni
export const registerAlumni = ({
  studentnum,
  fname,
  lname,
  email,
  mobile,
  password,
  salt,
}: {
  studentnum: number;
  email: string;
  fname: string;
  lname: string;
  mobile: string;
  password: string;
  salt: string;
}) => {
  try {
    const query = `
      INSERT INTO alumni
        (studentnum, fname, lname, email, mobile, password, salt)
      VALUES
        (?,?,?,?,?,?,?)`;
    const stmt = db.prepare(query);
    const info = stmt.run(
      studentnum,
      fname,
      lname,
      email,
      mobile,
      password,
      salt
    );
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

// Get certificate record (for external users)
export const getCertificate = (lName: string, id: string) => {
  try {
    const stmt = db.prepare(`SELECT
                                a.fname || ' ' || a.lname
                                    AS "alumniName",
                                SUBSTR(strftime('%Y', c.issuedate), 3) || PRINTF('%07d',c.id)
                                    AS "certId",
                                c.issuedate
                                    AS "issueDate"
                            FROM certificate c
                            JOIN alumni a
                                ON c.studentnum = a.studentnum
                            WHERE LOWER(lname) = LOWER(?)
                            AND "certID" = ?
                          `);
    const certificate: CertificateData | unknown = stmt.get(lName, id);
    return certificate;
  } catch (err) {
    console.log(`[ERROR] getCertificate function`);
    console.log(err);
  }
};
