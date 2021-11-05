/**
 * 
 */

 const REGISTER_API = "/register";
 const LOGIN_API = "/login";
 const LOGOUT_API = "/logout";
 
 const initUserService = (app) => {
   app.post(REGISTER_API, handleRegisterUser);
   app.post(LOGIN_API, handleUserLogin);
   app.post(LOGOUT_API, handleUserLogout);
 }
 
 module.exports = {initUserService};