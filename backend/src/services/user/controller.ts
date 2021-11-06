/**
 * User Controller
 * Handles requests from web clients and interfaces with various subsystems of the app
 */
import UserRepo from "./userRepo";
import { requiredFieldsMissing, isValidPassword, isValidSession } from "./utils";

import { MISSING_FIELDS_ERROR, INVALID_PASSWORD_ERROR, ALREADY_REGISTERED_ERROR, ERROR_CREATING_USER, USER_REGISTRATION_SUCCESS, USER_DOES_NOT_EXIST_ERROR } from "./constants";

class UserController {
  static async handleUserRegistration(req, res) {
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

    try {
      const userExists = await UserRepo.doesUserExist(username);
      if (userExists) {
        return res.status(400).json({
          isSuccessful: false,
          message: ALREADY_REGISTERED_ERROR,
        });
      }
      UserRepo.addUser(username, password)
        .then((result) => {
          console.log(result);
          return res.json({
            isSuccessful: true,
            message: USER_REGISTRATION_SUCCESS,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json({
            isSuccessful: false,
            message: ERROR_CREATING_USER,
          });
        });
    } catch (err) {
      return res.status(400).json({
        isSuccessful: false,
        message: ALREADY_REGISTERED_ERROR,
      });
    }  
  }

  static handleUserLogin(req, res) {
    const {username, password} = req.body;
    if (requiredFieldsMissing(username, password)) {
      return res.status(401).json({
        isSuccessful: false,
        message: MISSING_FIELDS_ERROR,
      })
    }

    UserRepo.doesUserExist(username)
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
    }).catch((err) => {
      console.log(err);
      return res.status(400).json({
      isSuccessful: false,
      message: ERROR_CREATING_USER,
    })});
  };

  static handleUserLogout(req, res) {
    if (isValidSession(req.session)) {
      return res.json({
        isSuccessful: false,
      });
    }
    
    // todo: add clean up
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
}

export default UserController;