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

app.listen(4000, () => console.log("server started!"))
