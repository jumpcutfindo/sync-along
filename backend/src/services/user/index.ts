/**
 * Defining routes for the User API
 */

import {AppEntryHandler} from "server";
import UserController from "./controller";

const REGISTER_API = "/register";
const LOGIN_API = "/login";
const LOGOUT_API = "/logout";

const initUserService: AppEntryHandler = (app) => {
  app.post(REGISTER_API, UserController.handleUserRegistration);
  app.post(LOGIN_API, UserController.handleUserLogin);
  app.post(LOGOUT_API, UserController.handleUserLogout);
}

export default initUserService;