/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
const FRONTEND_LOCAL_HOST = "http://localhost:3000";

const FRONTEND_URL = process.env.FRONTEND_SVC_SERVICE_PORT ?
    `http://${process.env.FRONTEND_SVC_SERGICE_HOST}:${process.env.FRONTEND_SVC_SERVICE_PORT}`
    : FRONTEND_LOCAL_HOST;

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = parseInt(process.env.REDIS_PORT);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL;

export {
    FRONTEND_URL,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    MONGODB_CONNECTION_URL
}