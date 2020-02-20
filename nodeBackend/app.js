// module imports
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const app = express();
const fs = require("fs");
const jwt = require("jsonwebtoken");

// encrpter to decrypt password recieved for login
const SimpleCrypto = require("simple-crypto-js").default;
const _secretKey = "asdasdjaksjdkajskl;asdjalksdj";
const crypto = new SimpleCrypto(_secretKey);
// read data from files // mock db
// nodes as a JSON obj as username as key and array of todos as value
const data = require("./data.json");
// user as a JSON obj as username as key and password as value
const users = require("./users.json");

//JWT to create token
const SECRET = "askjdansdkaksdjaklsdhja";
const jwt_verify = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, payload) => {
      return err
        ? err instanceof jwt.TokenExpiredError
          ? resolve()
          : reject(err)
        : resolve(payload);
    });
  });
const jwt_sign = val => jwt.sign(val, SECRET, { expiresIn: "1d" });

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/react")));
app.get("/", (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "public/react/index.html"));
  } catch {
    res.sendFile(path.join(__dirname, "public/404.html"));
  }
});
//wrapper error msgs
app.use(function(req, res, next) {
  res.error = err => res.json({ result: false, message: err });
  res.logout = err => res.json({ result: false, message: err, logout: true });
  next();
});

//auth middleware
async function auth(req, res, next) {
  try {
    var token = req.headers.token;
    let obj = await jwt_verify(token);
    if (obj) {
      req.user = obj.username;
      next();
    } else {
      res.logout("session expired");
    }
  } catch {
    res.logout("User Error. PLease login again.");
  }
}
// login post
//also data will be send here
app.post("/login", async (req, res) => {
  try {
    username = req.body.username;
    password = crypto.decrypt(req.body.password);
    if (username && password) {
      if (users[username] === password) {
        return res.json({
          result: true,
          data: data[username] || [],
          token: jwt_sign({ username })
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
  res.error("Server Error");
});

// add a new todo
app.post("/todo/add", auth, (req, res) => {
  try {
    console.log("here");
    let { title, desc, date } = req.body;
    let userdata = data[req.user];
    if (!userdata) {
      data[req.user] = [];
      userdata = [];
    }
    var last = userdata.slice(-1)[0];
    let lastID = null;
    if (last) {
      lastID = +last.id;
    } else {
      lastID = 0;
    }
    data[req.user].push({ title, desc, date, id: lastID + 1 });
    fs.writeFileSync("./data.json", JSON.stringify(data));
    res.json({
      result: true,
      data: data[req.user],
      token: jwt_sign({ username: req.user })
    });
  } catch (err) {
    console.log(err);
  }
});

//delete todo based on ID
app.delete("/todo/:id", auth, (req, res) => {
  let id = req.params.id;
  data[req.user] = data[req.user].filter(x => "" + x.id !== "" + id);
  fs.writeFileSync("./data.json", JSON.stringify(data));

  res.json({
    result: true,
    data: data[req.user],
    token: jwt_sign({ username: req.user })
  });
});
//update todo based on ID
app.put("/todo/:id", auth, (req, res) => {
  try {
    let id = req.params.id;
    let { title, desc } = req.body;
    let old = data[req.user].find(x => "" + x.id === "" + id);
    if (!old) throw new Error();
    if (title) {
      old.title = title;
    }
    if (desc) {
      old.desc = desc;
    }
    fs.writeFileSync("./data.json", JSON.stringify(data));
    res.json({
      result: true,
      data: data[req.user],
      token: jwt_sign({ username: req.user })
    });
  } catch (err) {
    console.log(err);
    res.error("Server Error");
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.end("404 not found");
});

module.exports = app;
