import dotenv from "dotenv";
if (process.env.NODE_ENV === "production") {
  console.log("Running in production enviroment");
  dotenv.config({ path: `${__dirname}/../.env.production` });
} else {
  console.log("Running in development enviroment");
  dotenv.config({ path: `${__dirname}/../.env.development` });
}

import crypto from "node:crypto";
// import db from "./db";
import { insertAdmin, insertAlumniWithCert, registerAlumni } from "./dbQueries";

const adminData = [
  {
    id: 1000000,
    fname: "Alex",
    lname: "A",
    email: "admin@test.com",
    mobile: "0400000000",
    password: "asdASD123!@#",
  },
];

const alumniData = [
  {
    studentnum: 3635950,
    fname: "John",
    lname: "Alaxv",
  },
  {
    studentnum: 3635951,
    fname: "Alex",
    lname: "Jordan",
  },
  {
    studentnum: 3635952,
    fname: "Samual",
    lname: "George",
  },
];

const alumniRegisterData = [
  {
    studentnum: 3635950,
    email: "a@test.com",
    mobile: "0400000000",
    password: "asdASD123!@#",
  },
  {
    studentnum: 3635951,
    email: "b@test.com",
    mobile: "0400000000",
    password: "asdASD123!@#",
  },
  {
    studentnum: 3635952,
    email: "c@test.com",
    mobile: "0400000000",
    password: "asdASD123!@#",
  },
];

const salt = crypto.randomBytes(16).toString("hex");
const iterations = 310000;
const keyLength = 32;

adminData.forEach((data) => {
  const hashedPassword = crypto
    .pbkdf2Sync(data.password, salt, iterations, keyLength, "sha256")
    .toString("hex");
  // Store the user in the db
  const _ = insertAdmin({
    id: data.id,
    fname: data.fname,
    lname: data.lname,
    email: data.email,
    mobile: data.mobile,
    password: hashedPassword,
    salt,
  });
});

alumniData.forEach((data) => {
  // Store the user in the db
  const info = insertAlumniWithCert({
    studentnum: data.studentnum,
    fname: data.fname,
    lname: data.lname,
  });
  console.log(info);
});

alumniRegisterData.forEach((data) => {
  const hashedPassword = crypto
    .pbkdf2Sync(data.password, salt, iterations, keyLength, "sha256")
    .toString("hex");
  // Store the user in the db
  const _ = registerAlumni({
    studentnum: data.studentnum,
    email: data.email,
    mobile: data.mobile,
    password: hashedPassword,
    salt,
  });
});
