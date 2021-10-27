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


// Chat app
let usersInChat = [];
const socket = require("socket.io");
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

const c_users = [];

// joins the user to the specific chatroom
function join_User(id, username, room) {
  const p_user = { id, username, room };

  c_users.push(p_user);
  console.log(c_users, "users");

  return p_user;
}

function get_Current_User(id) {
  return c_users.find((p_user) => p_user.id === id);
}

// called when the user leaves the chat and its user object deleted from array
function user_Disconnect(id) {
  const index = c_users.findIndex((p_user) => p_user.id === id);

  if (index !== -1) {
    return c_users.splice(index, 1)[0];
  }
}

io.on("connection", (socket) => {
  socket.on("joinRoom", ({username, roomname}) => {
    const p_user = join_User(socket.id, username, roomname);
    console.log(`${socket.id}=id`);
    socket.join(p_user.room);
    io.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: "hi",
    });
  });

  socket.on("chat", (text) => {
    const p_user = get_Current_User(socket.id);
    io.to(p_user.room).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      text: text,
    });
  });

  socket.on("disconnect", () => {
    const p_user = user_Disconnect(socket.id);
  })
})