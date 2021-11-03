const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session");
const fs = require("fs");

const nodeoutlook = require('nodejs-nodemailer-outlook');
const bcrypt = require("bcrypt"); 
const sqlite3 = require('sqlite3').verbose();

const SALT_NO_ROUNDS = 10;

if (!fs.existsSync("./database")) { // create folder if not exists
  fs.mkdirSync("./database");
}
fs.closeSync(fs.openSync("./database/accounts.db", 'w'));

let db = new sqlite3.Database('./database/accounts.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS accounts(
    username TEXT PRIMARY KEY,
    hashedPassword TEXT NOT NULL,
    emailAddress TEXT
    )`);

const app = express();

app.use(
    session({
      secret: "secret",
      resave: false,
      cookie: { secure: false }, // cookie expires in 8 hours
      saveUninitialized: false,
    })
  );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

/* Checks if the username already exists in the database */
function checkIfUserExists(username, callback) {
  const sql = `SELECT (SELECT (username) FROM accounts WHERE username=?) AS username`
  // returns the username field with null if the username is not found, 
  // else return the username itself
  const params = [username];
  db.get(sql, params, (err, row) => {
      if (err) {
        log.info(err.message);
      }
      callback(row.username);
    }
  );
}

/* Adds a particular user with their profile details to the database */
function addUser(username, hashedPassword) {
    const sql = "INSERT INTO accounts (username, hashedPassword) VALUES (?,?)"; // to be string formatted
    const params = [username, hashedPassword];

    db.run(sql, params, (err) => {
        if (err) {
          console.log("Error found when addUser ${err.message}");
        }
      }
    );
}

// Get particular user in database
async function getUser(username, callback) {
  db.get(
    `SELECT (SELECT (hashedPassword) FROM accounts WHERE username=?) AS hashedPassword`,
    [username],
    (err, row) => {
      if (err) {
        log.info(err.message);
      }
      callback(row.hashedPassword);
    }
  );
}

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.post("/sign-up", async (req, res) => {
  console.log(`/sign-up call received at server ${JSON.stringify(req.body)}`);

  const username = req.body.username;
  const password = req.body.password;

  if (!(username && password)) {
    return res.json({
      isSuccessful: false,
      message: "Some fields are missing. Please fill up all the fields."
    });
  }

  if (password.length < 6) {
    return res.json({
      isSuccessful: false,
      message: "Password has to be as least 6 characters"
    });
  }

  checkIfUserExists(username, isUserExists => {
    if (isUserExists) {
      return res.json({
        isSuccessful: false,
        message: "This e-mail is already registered. Please log in."
      });
    }

    bcrypt.hash(password, SALT_NO_ROUNDS).then(async (hashedPassword) => {
      addUser(username, hashedPassword);
    });

    return res.json({
      isSuccessful: true,
      message: "User registration is successful."
    });
  });
});

app.post("/login", async (req, res) => {
  console.log(`/login received at server ${JSON.stringify(req.body)}`);

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.json({
      isSuccessful: false,
      message: "Please enter your username and password."
    });
  }

  getUser(username, (hashedPassword) => {
    if (!hashedPassword) { // user not found in the database
      return res.json({
        isSuccessful: false,
        message: 'Your username or password is incorrect. Please try again. [1]'
      })
    }

    bcrypt.compare(password, hashedPassword, (err, result) => {
      if (err) {
        return res.json({
          isSuccessful: false,
          message: 'Unknown error occured, error code login-A.'
        });
      }

      if (!result) { // password does not match
        return res.json({
          isSuccessful: false,
          message: 'Your username or password is incorrect. Please try again. [2]'
        });
      }

      req.session.isLoggedIn = true;
      req.session.username = username;

      return res.json({
        isSuccessful: true,
        message: "Login successful.",
      });
    });
  });
});

app.get("/check-session", (req, res) => {
  if (!req.session || !req.session.isLoggedIn) {
    return res.json({
      isSuccessful: false,
    });
  }

  return res.json({
    isSuccessful: true,
    username: req.session.username,
  });
})


/* user logs out */
app.get("/logout", (req, res) => {
  if (!req.session || !req.session.isLoggedIn) {
    return res.json({
      isSuccessful: false, // user is already logged out
    });
  }

  req.session.destroy();
  return res.json({
    isSuccessful: true,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})