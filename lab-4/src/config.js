import { config } from 'dotenv';
config();

export const TOKEN_HEADER = 'Authorization';
export const port = 3000;

export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
export const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
export const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
export const AUTH0_CONNECTION = process.env.AUTH0_CONNECTION;

export const AUTH0_PASSWORD_GRANT_SCOPE = 'offline_access';
