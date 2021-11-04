/**
 * User Controller
 * Handles requests from web clients and interfaces with various subsystems of the app
 */

const {addUser, doesUserExist} = require("./userDao");
const {requiredFieldsMissing, isValidPassword, isValidSession} = require("./utils");

const MISSING_FIELDS_ERROR = "Some fields are missing. Please fill up all the fields";
const INVALID_PASSWORD_ERROR = "Passwords have to be at least 6 characters.";
const ALREADY_REGISTERED_ERROR = "This e-mail is already registered. Please log in.";
const ERROR_CREATING_USER = "An error occurred while trying to register the user.";
const USER_REGISTRATION_SUCCESS = "User Registration is successful.";
const USER_DOES_NOT_EXIST_ERROR = "The user does not exist in this app.";

/**
 * When Refactor to Typescript
 * Add interface for User Service:
 * interface UserControllerInterface {
 * handleRegisterUser;
 * handleUserLogin;
 * handleLogout;
 * }
 */
const handleUserRegistration = (req, res) => {
  const {username, password} = req.body;

  if (requiredFieldsMissing(username, password)) {
    return res.status(401).json({
      isSuccessful: false,
      message: MISSING_FIELDS_ERROR,
    });
  }

  if (isValidPassword(password)) {
    return res.status(401).json({
      isSuccessful: false,
      message: INVALID_PASSWORD_ERROR,
    });
  }

  if (doesUserExist(username)) {
    return res.status(400).json({
      isSuccessful: false,
      message: ALREADY_REGISTERED_ERROR,
    });
  }

  addUser(username, password)
    .then(() => res.json({
      isSuccessful: true,
      message: USER_REGISTRATION_SUCCESS,
    }))
    .catch(() => res.json({
        isSuccessful: false,
        message: ERROR_CREATING_USER,
      })
    );
}

const handleUserLogin = (req, res) => {
  const {username, password} = req.body;
  if (requiredFieldsMissing(username, password)) {
    return res.status(401).json({
      isSuccessful: false,
      message: MISSING_FIELDS_ERROR,
    })
  }

  doesUserExist(username)
    .then((isUserFound) => {
      if (isUserFound) {
        req.session.isLoggedIn = true;
        req.session.username = username;
        return res.status(200).json({
          isSuccessful: true,
          username,
        });
      } else {
        return res.status(401).json({
          isSuccessful: false,
          message: USER_DOES_NOT_EXIST_ERROR,
        });
      }
  }).catch(() => res.status(400).json({
    isSuccessful: false,
    message: ERROR_CREATING_USER,
  }))
};

const handleUserLogout = (req, res) => {
  if (isValidSession(req.session)) {
    return res.json({
      isSuccessful: false,
    });
  }

  req.session.destroy((err) => {
    if (err) {
      res.status(400).json({
        isSuccessful: false,
      });
    } else {
      res.clearCookie("connect.sid", {path: "/"}).json({
        isSuccessful: true,
      });
    }
  });
};


module.exports = {handleUserRegistration, handleUserLogin, handleUserLogout};