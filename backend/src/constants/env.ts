/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const REDIS_HOST = process.env.REDIS_HOST || "redis-13406.c1.asia-northeast1-1.gce.cloud.redislabs.com";
const REDIS_PORT = parseInt(process.env.REDIS_PORT) || 13406;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "HOBL9WbJWOuNUaFBnTFPBxS49sVFQSyu";

const MONGODB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL || "mongodb+srv://admin:admin@cluster0.csain.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

export {
    FRONTEND_URL,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    MONGODB_CONNECTION_URL
}