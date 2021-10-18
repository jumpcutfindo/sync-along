const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.post('/login', (req, res) => {
  const {username, password} = req.body;
  console.log(username, password);
  if (username === "test" && password === "test") {
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

const server = app.listen(4000, () => console.log("server started!"))


// // Chat app
// let usersInChat = [];
// const socket = require("socket.io");
// const io = socket(server);

// function joinUser(id, username, roomName) {
//   const user = {id, username, roomName};
//   usersInChat.push(user);
//   return user;
// }

// function getCurrentUser(id) {
//   return usersInChat.find((user) => user.id === id);
// }

// function userDisconnect(id) {
//   usersInChat = usersInChat.filter((user) => user.id !== id);
// }
