import { Router } from "express";

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
  res.end("/api/verify route is working!");
});

export default api;
