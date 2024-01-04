import url from 'url';
import { config } from 'dotenv';
config();

export const HOST = process.env.HOST;
export const PORT = process.env.PORT;

export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
export const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
export const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
export const AUTH0_CONNECTION = process.env.AUTH0_CONNECTION;

export const AUTH0_PASSWORD_GRANT_SCOPE = 'offline_access';

export const AUTH0_AUTHORIZE_REDIRECT_URI = `http://${HOST}:${PORT}`;
export const AUTH0_AUTHORIZE_RESPONSE_TYPE = 'code';
export const AUTH0_AUTHORIZE_RESPONSE_MODE = 'query';
export const AUTH0_AUTHORIZE_STATE = process.env.AUTH0_AUTHORIZE_STATE;
export const AUTH0_AUTHORIZE_SCOPE = 'offline_access profile';

export const AUTH0_AUTHORIZE_URI = url.format({
  protocol: 'https',
  host: `${AUTH0_DOMAIN}/authorize`,
  query: {
    client_id: AUTH0_CLIENT_ID,
    redirect_uri: AUTH0_AUTHORIZE_REDIRECT_URI,
    response_type: AUTH0_AUTHORIZE_RESPONSE_TYPE,
    response_mode: AUTH0_AUTHORIZE_RESPONSE_MODE,
    scope: AUTH0_AUTHORIZE_SCOPE,
    state: AUTH0_AUTHORIZE_STATE,
    audience: AUTH0_AUDIENCE,
  },
});
