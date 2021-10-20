const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var session = require("express-session");

const rooms = new Map(); // room -> list of users
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    session({
      secret: "secret",
      resave: false,
      cookie: { secure: false }, // cookie expires in 8 hours
      saveUninitialized: false,
    })
  );

app.get('/', (req, res) => {
    GLOBAL += 1;
    console.log(`current GLOBAL=${GLOBAL}`);
    res.send('Hello World!');
})

/* F3.1 The application should allow users to create a room with a randomly generated room code. */
app.post('/create', (req, res) => {
    while (true) {
        const code = Math.random().toString(36).substr(2, 5).toUpperCase();
    
        if (!rooms.has(code)) { // new room code
            rooms.set(code, 0);
            console.log(`rooms=${[...rooms.entries()]}`);

            return res.json({
                code: code,
            });
        }
    }
})

/* F3.2 The application should allow users to join a room using a valid room code */
app.post('/join', (req, res) => {
    const code = req.body.code;

    if (!rooms.has(code)) {
        return res.status(404).json({
            isSuccessful: false, // room not found
        })
    }

    return res.status(200).json({
        isSuccessful: true,
    })
})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server listening on port ${port}`));
