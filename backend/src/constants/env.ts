/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
const FRONTEND_LOCAL_HOST = "http://localhost:3000";

export const FRONTEND_URL = process.env.FRONTEND_SVC_SERVICE_PORT ?
    `http://${process.env.FRONTEND_SVC_SERGICE_HOST}:${process.env.FRONTEND_SVC_SERVICE_PORT}`
    : FRONTEND_LOCAL_HOST;
