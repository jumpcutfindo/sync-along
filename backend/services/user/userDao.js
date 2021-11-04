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
    const hashedPassword = await bcrypt.hash(password, SALT_NO_ROUNDS);
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
  return new Promise((resolve, reject) =>
      User.exists({ username})
        .then((doesUserExist) => resolve(doesUserExist))
        .catch((err) => reject(err))
  );
};

module.exports = {addUser, doesUserExist};