import SQLite3, { Database } from "better-sqlite3";

const backendDir = `${__dirname}`;

const db: Database = new SQLite3(`${backendDir}/${process.env.DB_NAME}`, {
  verbose: console.log,
});

console.log("DB file loaded!");

export default db;
