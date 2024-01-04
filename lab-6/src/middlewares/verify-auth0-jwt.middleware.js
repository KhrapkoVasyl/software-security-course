import { auth } from 'express-oauth2-jwt-bearer';
import { AUTH0_AUDIENCE, AUTH0_DOMAIN } from '../config.js';

export const verifyAuth0Jwt = auth({
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: `https://${AUTH0_DOMAIN}/`,
});
