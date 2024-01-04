import {
  AUTH0_AUDIENCE,
  AUTH0_AUTHORIZE_REDIRECT_URI,
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

  loginByAuthCode(code) {
    return this.#authClient.oauth.authorizationCodeGrant({
      code,
      redirect_uri: AUTH0_AUTHORIZE_REDIRECT_URI,
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
}

export const authService = new AuthService(authClient, managementClient);
