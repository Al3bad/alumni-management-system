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
  id: string; // {PK}
  issueDate: string;
  studentNum: number; // {FK}
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
                                id TEXT NOT NULL UNIQUE PRIMARY KEY,
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

// Insert new alumni (by admins)

// Update alumni record (when alumni register)

// Get alumni record (for profile page)

// ==============================================
// ==> Certificate Queries
// ==============================================

// Insert new certificate (by admin)

// Get certificate record (for external users)
