import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { TOKEN_HEADER, port } from './config.js';
import { authService } from './services/auth.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static('src/pages'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sendUnauthorizedRes = (res) => res.status(401).send('Unauthorized');

app.use(async (req, res, next) => {
  const bearerToken = req.get(TOKEN_HEADER);

  if (!bearerToken) {
    return next();
  }

  try {
    const { sub: userId } = await authService.verifyAccessToken(bearerToken);

    const user = await authService.getUser({ id: userId });
    req.user = user;
  } catch {
    return sendUnauthorizedRes(res);
  }

  return next();
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/profile.html'));
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/login.html'));
});

app.get('/registration', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/registration.html'));
});

app.get('/api/profile', (req, res) => {
  const email = req.user?.email;

  if (email) {
    return res.json({ email });
  }

  return res.status(404).send(`User profile was not found`);
});

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
