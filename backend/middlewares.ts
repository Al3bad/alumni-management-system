import { Request, Response, NextFunction } from "express";
import expressSession from "express-session";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return next();
  /* res.redirect("/login"); */
  res.statusCode = 401;
  res.json({ statusCode: 401, msg: "Unauthorized" });
};

export const cors = (req: Request, res: Response, next: NextFunction) => {
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
};

export const session = () => {
  return expressSession({
    secret: process.env.SESSION_SECRET || "my-secret",
    resave: false,
    saveUninitialized: false,
  });
};
