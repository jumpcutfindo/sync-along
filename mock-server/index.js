const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.post('/login', (req, res) => {
  const {username, password} = req.body;
  console.log(username, password);
  if (username.startsWith("test") && password.startsWith("test")) {
    res.status(200).json({
      accessToken: "testToken",
    });
  } else {
    res.status(401).json({
      message: "Error!",
    });
  }
})

// Room code
app.post('/room/new', (req, res) => {
  res.status(200).json({
    roomCode: `${Math.ceil(Math.random() * 1000)}`,
  });
})

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => console.log(`server started at ${PORT}`));
