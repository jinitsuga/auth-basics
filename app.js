const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

const mongoDb =
  "mongodb+srv://jinitsuga:qweasd356@talentscluster.o0zdqp1.mongodb.net/users";

mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongodb error connection"));

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

const app = express();

app.set("views", __dirname);
app.set("view engine", "ejs");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "wrong username" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "wrong password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index", { user: req.user });
});

app.get("/sign-up", (req, res) => res.render("signUpForm"));

app.post("/signUpForm", (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPw) => {
    if (err) {
      return next(err);
    }
    const user = new User({
      username: req.body.username,
      password: hashedPw,
    });
    const result = user.save();
    res.redirect("/");
  });
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

// Using 'logout' function provided by Passport js

app.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(3000, () => console.log("app is listening on port 3000!"));
