import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { AUTH0_AUTHORIZE_URI, HOST, PORT } from './config.js';
import { authService } from './services/auth.service.js';
import { verifyAuth0Jwt } from './middlewares/verify-auth0-jwt.middleware.js';
import { retrieveUserFromJwtPayload } from './middlewares/retrieve-user-from-jwt-payload.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static('src/pages'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sendUnauthorizedRes = (res) => res.status(401).send('Unauthorized');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/profile.html'));
});

app.get('/login', (req, res) => {
  return res.redirect(AUTH0_AUTHORIZE_URI);
});

app.get('/registration', (req, res) => {
  return res.redirect(AUTH0_AUTHORIZE_URI);
});

app.get(
  '/api/profile',
  verifyAuth0Jwt,
  retrieveUserFromJwtPayload,
  (req, res) => {
    const email = req.user?.email;

    if (email) {
      return res.json({ email });
    }

    return res.status(404).send('User profile was not found');
  }
);

app.post('/api/login', (req, res) => {
  const { login: email, password } = req.body;

  return authService
    .login({ email, password })
    .then(({ data }) =>
      res.status(201).json({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      })
    )
    .catch(() => sendUnauthorizedRes(res));
});

app.post('/api/refresh-tokens', (req, res) => {
  const { refreshToken } = req.body;

  return authService
    .refreshTokens(refreshToken)
    .then((result) => {
      const { data } = result;
      return res.status(201).json({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
    })
    .catch((err) => {
      res.status(400).send(err.message);
    });
});

app.post('/api/registration', async (req, res) => {
  const { email, password } = req.body;

  try {
    await authService.register({ email, password });
    const { data } = await authService.login({ email, password });
    const tokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
    return res.status(201).send(tokens);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Example app listening on port ${PORT}`);
});
