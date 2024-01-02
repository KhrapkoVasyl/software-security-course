import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { port } from './config.js';
import { authService } from './services/auth.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static('src/pages'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sendUnauthorizedRes = (res) => res.status(401).send('Unauthorized');

// TODO: implement parsing JWT token payload using base64

// app.use((req, res, next) => {
//   console.log(new Date());
//   console.log(req.headers);
//   const token = req.get(TOKEN_HEADER);
//   console.log(token);
//   if (!token) {
//     return next();
//   }

//   console.log('\n\nHere\n\n');

//   try {
//     // const { username, exp } = jwt.verify(token, JWT_SECRET);
//     // const expDate = new Date(exp * 1000);
//     const expDate = new Date(new Date() * 1000); // TODO

//     req.user = { username };
//     req.expDate = expDate;
//   } catch {
//     return sendUnauthorizedRes(res);
//   }

//   return next();
// });

app.get('/', (req, res) => {
  const email = req.user?.email;
  console.log(email);
  if (email) {
    return res.json({ email, expDate: req.expDate });
  }
  res.sendFile(path.join(__dirname, 'pages/login.html'));
});

app.get('/registration', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/registration.html'));
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
    .catch(() => res.status(400).send(err.message));
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
