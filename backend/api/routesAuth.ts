import crypto from "node:crypto";
import { Router } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { checkAuth } from "./../middlewares";
import {
  getUserByStudentNum,
  getUserByEmail,
  registerAlumni,
} from "./../dbQueries";
import db from "./../db";
import { registerFormValidationBackendSchema } from "./../../common/validation";

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/42055#issuecomment-582808927
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface User {
      studentnum: string;
      lname: string;
    }
  }
}

type AlumniUser = {
  studentnum: number;
  fname: string;
  lname: string;
  email?: string | undefined;
  password?: string | undefined;
  salt?: string | undefined;
};

// ==============================================
// ==> Passport Config
// ==============================================
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    function verify(username, password, cb) {
      try {
        const iterations = 310000;
        const keyLength = 32;
        const hashedEmail = crypto
          .pbkdf2Sync(
            username,
            process.env.EMAIL_SALT || "303858f99ea838d56e08d4e2578a2314",
            iterations,
            keyLength,
            "sha256"
          )
          .toString("hex");
        const stmt = db.prepare("SELECT * FROM alumni WHERE email = ?");
        const user: AlumniUser | any = stmt.get(hashedEmail);
        console.log(username, hashedEmail);
        // Check user existance
        const isRegistered = user && (!user?.email || !user?.salt);
        if (!user || (user && isRegistered)) {
          return cb(null, false, {
            message: "User with this email doesn't exist!",
          });
        }
        // Check password
        const hashedPass = crypto
          .pbkdf2Sync(password, user.salt, iterations, keyLength, "sha256")
          .toString("hex");
        if (hashedPass !== user.password)
          return cb(null, false, { message: "Incorrect username or password" });
        // Valid credential
        return cb(null, { studentnum: user.studentnum, lname: user.lname });
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  console.log("Serialize ", user);
  process.nextTick(function () {
    cb(null, {
      studentnum: user.studentnum,
      lname: user.lname,
    });
  });
});

passport.deserializeUser(function (user: Express.User | false | null, cb) {
  console.log("Deserialize ", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

const router = Router();

// ==============================================
// ==> Check Auth for Testing
// ==============================================
router.get("/check-auth", checkAuth, (_, res) => {
  res.end("You're authenticated :)");
});

// ==============================================
// ==> Get Info of Authenticated Alumni
// ==============================================
router.get("/user-info", checkAuth, (req, res) => {
  if (!req.user) {
    res.statusCode = 401;
    res.json({
      statusCode: 401,
      error: {
        msgCode: "C-AUTH",
        msg: "Unauthaorized user. Please Login!",
      },
    });
  } else {
    res.json({ statusCode: 200, user: req.user });
  }
});

// ==============================================
// ==> Register Alumni
// ==============================================
router.post("/register", async (req, res, next) => {
  console.log("/api/register route is working!");
  console.log(req.body);

  // Vallidate input
  const isValid = await registerFormValidationBackendSchema.isValid(req.body);
  console.log(`Form data is ${isValid ? "valid" : "invalid"}!`);
  const { studentID, fname, lname, email, mobile, password } = req.body;

  // form data is not valid?
  //    res with bad req
  if (!isValid) {
    res.statusCode = 400;
    return res.json({
      error: {
        msg: "Provided form data is invalid!",
      },
    });
  }

  const studentnum = parseInt(studentID.slice(1));
  const alumniUser: any = getUserByStudentNum(studentnum);
  // Check if the user is already in the system
  // Alumni found using the provided student number?
  //    res with bad req
  if (alumniUser) {
    res.statusCode = 400;
    return res.json({
      error: {
        msg: "Alumni already exists in the system! Please login using your email and password!",
      },
    });
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const iterations = 310000;
  const keyLength = 32;
  const hashedEmail = crypto
    .pbkdf2Sync(
      email,
      process.env.EMAIL_SALT || "303858f99ea838d56e08d4e2578a2314",
      iterations,
      keyLength,
      "sha256"
    )
    .toString("hex");

  // Check if the eamil already used
  // Alumni tries to register with an already existing email?
  //    res with bad req
  if (!alumniUser && getUserByEmail(email)) {
    res.statusCode = 400;
    return res.json({
      error: {
        msg: "This email already used!",
      },
    });
  }
  // Hash the info
  const hashedMobile = crypto
    .pbkdf2Sync(mobile, salt, iterations, keyLength, "sha256")
    .toString("hex");
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, iterations, keyLength, "sha256")
    .toString("hex");
  console.log(hashedEmail, hashedMobile, hashedPassword, salt);
  // Store the user in the db
  const info = registerAlumni({
    studentnum,
    fname,
    lname,
    email: hashedEmail,
    mobile: hashedMobile,
    password: hashedPassword,
    salt,
  });

  // authenticate user after register
  passport.authenticate(
    "local",
    function (err: any, user: any, info: any, status: any) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.statusCode = 404;
        return res.end("User not found!");
      }
      console.log("You're logged in now");
      (req.session as any).passport = {};
      (req.session as any).passport.user = user;
      req.login(user, next);
    }
  )(req, res, next);

  // authenticate user after register
  res.statusCode = 200;
  return res.json({
    user: req.user,
  });
});

// ==============================================
// ==> Login Alumni
// ==============================================
router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log(req.session);
  if (req.isAuthenticated()) {
    console.log(`Logged in user:`, req.user);
    return res.json({
      statusCode: 200,
      user: req.user,
    });
  }
});

// ==============================================
// ==> Logout Alumni
// ==============================================
// reference: https://stackoverflow.com/a/50473675/10823489
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.end("Logged out");
    });
  });
});

export default router;
