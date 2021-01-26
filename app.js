require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltrounds = 10;
// const md5 = require("md5");
// const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  bcrypt.hash(password, saltrounds, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      const newUser = new User({
        email: email,
        password: hash,
      });
      newUser.save((err) => {
        if (!err) {
          res.render("secrets");
        } else {
          console.log(err);
        }
      });
    }
  });
});

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
          if (result === true) {
            res.render("secrets");
          }
        });
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Listining to the port 3000");
});
