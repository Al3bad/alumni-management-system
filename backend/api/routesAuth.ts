import crypto from "node:crypto";
import { Router } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { checkAuth } from "./../middlewares";
import {
  getUser,
  registerAlumni,
  insertCertificate,
  getAlumniDocs,
} from "./../dbQueries";
import db from "./../db";
import { registerFormValidationBackendSchema } from "./../../common/validation";

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/42055#issuecomment-582808927
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface User {
      id: number;
      fname: string;
      lname: string;
      role: string;
    }
  }
}

type User = {
  id: number;
  fname: string;
  lname: string;
  email?: string | undefined;
  password?: string | undefined;
  salt?: string | undefined;
  role: string;
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
        const stmt = db.prepare("SELECT * FROM user WHERE email = ?");
        const user: User | any = stmt.get(username);
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
        return cb(null, {
          id: user.id,
          fname: user.fname,
          lname: user.lname,
          role: user.role,
        });
      } catch (err) {
        return cb(err);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user: Express.User | false | null, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const router = Router();

// ==============================================
// ==> Get Info of Authenticated Alumni
// ==============================================
router.get("/user", checkAuth, (req, res) => {
  if (req.user?.id) {
    if (req.user.role === "student") {
      const docs = getAlumniDocs(req.user.id);
      res.json({ info: req.user, docs });
    } else if (req.user.role === "admin") {
      res.json({ info: req.user });
    } else {
      res.statusCode = 500;
      return res.json({
        error: {
          msg: "Something wrong happend!",
        },
      });
    }
  } else {
    res.statusCode = 404;
    return res.json({
      error: {
        msg: "User not found!",
      },
    });
  }
});

// router.get("/admin", checkAuth, (req, res) => {
//   if (req.user?.id) {
//     res.json({ user: req.user });
//   } else {
//     res.statusCode = 404;
//     return res.json({
//       error: {
//         msg: "User not found!",
//       },
//     });
//   }
// });

// ==============================================
// ==> Register Alumni
// ==============================================
router.post("/register", async (req, res, next) => {
  // Vallidate input
  const isValid = await registerFormValidationBackendSchema.isValid(req.body);
  const { studentID, email, mobile, password } = req.body;

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
  const alumniUser: any = getUser(studentnum);
  // Check if the user is already in the system
  // Alumni not found using the provided student number?
  //    res with bad req
  if (!alumniUser) {
    res.statusCode = 400;
    return res.json({
      error: {
        msg: "No alumni found in the system with the provided student ID!",
      },
    });
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const iterations = 310000;
  const keyLength = 32;

  // Check if the eamil already used
  // Alumni tries to register with an already existing email?
  //    res with bad req
  if (alumniUser && alumniUser.email) {
    res.statusCode = 400;
    return res.json({
      error: {
        msg: "This email already used!",
      },
    });
  }
  // Hash the info
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, iterations, keyLength, "sha256")
    .toString("hex");
  // Store the user in the db
  const info = registerAlumni({
    studentnum,
    email: email,
    mobile: mobile,
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
      (req.session as any).passport = {};
      (req.session as any).passport.user = user;
      req.login(user, next);
    }
  )(req, res, next);

  if (req.user?.id) {
    // authenticate user after register
    res.statusCode = 200;
    res.json({ user: req.user });
  } else {
    return res.json({
      error: {
        msg: "Something wrong happend in the server!",
      },
    });
  }
});

// ==============================================
// ==> Login Alumni
// ==============================================
router.post("/login", passport.authenticate("local"), (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
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
