/**
 * Controller for the Room Service
 * Interfaces with subsystems of the backend.
 */

const {generateRoomCode} = require("./utils");
const {doesRoomExist, addUserToRoom} = require("./roomDao");
const NO_USERNAME_PROVIDED = "Please provide a username to create a room";
const ERROR_JOINING_ROOM = "Unable to join a room";

const handleCreateRoom = async (req, res) => {
  const {username} = req.body;
  if (!username) {
    return res.status(400).json({
      isSuccessful: false,
      message: NO_USERNAME_PROVIDED,
    });
  }

  let generatedCode = generateRoomCode();
  while (await doesRoomExist(generatedCode)) {
    console.log(generatedCode);
    generatedCode = generateRoomCode();
  }
  addUserToRoom(username, generatedCode)
    .then(() => res.status(200).json({
      code: generatedCode,
    }))
    .catch(() => res.status(400).json({
      message: ERROR_JOINING_ROOM
    }));
};

module.exports = {handleCreateRoom};