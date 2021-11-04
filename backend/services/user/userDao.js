/**
 * Data Management Layer for the User Management system
 * Interacts with the UserModel in the database to retrieve User Data.
 */

const bcrypt = require("bcrypt");
const User = require("./model");

/**
 * When move to typescript
 * interface UserDao {
 * addUser;
 * doesUserExist;
 * }
 */

const SALT_NO_ROUNDS = 10;

const addUser = async (username, password) => {
  try {
    const hashedPassword = bcrypt.hash(password, SALT_NO_ROUNDS);
    const newlyCreatedUser = await User.create({
      username,
      password: hashedPassword
    });
    return newlyCreatedUser;
  } catch (err) {
    throw err;
  }
};

const doesUserExist = async (username) => {
  try {
    const doesUserExist = await User.exists({
      username
    });
    return doesUserExist;
  } catch (err) {
    throw err;
  }
};

module.exports = {addUser, doesUserExist};