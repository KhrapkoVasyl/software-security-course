import {
  AUTH0_AUDIENCE,
  AUTH0_CONNECTION,
  AUTH0_PASSWORD_GRANT_SCOPE,
} from '../config.js';
import { authClient } from './auth.client.js';
import { managementClient } from './management.client.js';

class AuthService {
  #authClient;
  #managementClient;

  constructor(authClient, managementClient) {
    this.#authClient = authClient;
    this.#managementClient = managementClient;
  }

  login({ email, password }) {
    return this.#authClient.oauth.passwordGrant({
      username: email,
      password,
      scope: AUTH0_PASSWORD_GRANT_SCOPE,
      audience: AUTH0_AUDIENCE,
    });
  }

  register({ email, password }) {
    return this.#authClient.database.signUp({
      email,
      password,
      connection: AUTH0_CONNECTION,
    });
  }

  refreshTokens(refreshToken) {
    return this.#authClient.oauth.refreshTokenGrant({
      refresh_token: refreshToken,
    });
  }

  getUser(conditions) {
    return this.#managementClient.users
      .get(conditions)
      .then(({ data }) => data);
  }

  async verifyAccessToken(bearerToken) {
    const token = bearerToken.split(' ').pop();
    const payloadBase64 = token.split('.')[1];
    const payloadString = atob(payloadBase64);
    return JSON.parse(payloadString);
  }
}

export const authService = new AuthService(authClient, managementClient);
