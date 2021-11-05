/**
 * Defining routes for the User API
 */

import {AppEntryHandler} from "server";
import {handleUserRegistration, handleUserLogin, handleUserLogout} from "./controller";

const REGISTER_API = "/register";
const LOGIN_API = "/login";
const LOGOUT_API = "/logout";

const initUserService: AppEntryHandler = (app) => {
  app.post(REGISTER_API, handleUserRegistration);
  app.post(LOGIN_API, handleUserLogin);
  app.post(LOGOUT_API, handleUserLogout);
}

export default initUserService;