const MIN_PASSWORD_LENGTH = 6;

const requiredFieldsMissing = (username, password) => !(username && password);

const isValidPassword = (password) => password.length < MIN_PASSWORD_LENGTH;

const isValidSession = (session) => session && session.isLoggedIn;

module.exports = {requiredFieldsMissing, isValidPassword, isValidSession};