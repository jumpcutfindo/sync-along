/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
const LOCAL_HOST = "http://localhost:4001";

export const BACKEND_URL = process.env.BACKEND_SVC_SERVICE_PORT ?
    `http://${process.env.BACKEND_SVC_SERVICE_HOST}:${process.env.BACKEND_SVC_SERVICE_PORT}`
    : LOCAL_HOST;
