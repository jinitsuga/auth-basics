const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => res.render("index"));

app.listen(3000, () => console.log("app is listening on port 3000!"));
