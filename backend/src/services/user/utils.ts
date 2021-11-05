const MIN_PASSWORD_LENGTH = 6;

export const requiredFieldsMissing = (username, password) => !(username && password);
export const isValidPassword = (password) => password.length < MIN_PASSWORD_LENGTH;
export const isValidSession = (session) => session && session.isLoggedIn;

