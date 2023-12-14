const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const TOKEN_HEADER = 'Authorization';
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const sendUnauthorizedRes = (res) => res.status(401).send('Unauthorized');

app.use((req, res, next) => {
  const token = req.get(TOKEN_HEADER);

  if (!token) {
    return next();
  }

  try {
    const { username, exp } = jwt.verify(token, JWT_SECRET);
    const expDate = new Date(exp * 1000);

    req.user = { username };
    req.expDate = expDate;
  } catch {
    return sendUnauthorizedRes(res);
  }

  return next();
});

app.get('/', (req, res) => {
  const username = req.user?.username;
  console.log(username);
  if (username) {
    return res.json({ username, expDate: req.expDate });
  }
  res.sendFile(path.join(__dirname + '/index.html'));
});

const users = [
  {
    login: 'Login',
    password: 'Password',
    username: 'Username',
  },
  {
    login: 'Login1',
    password: 'Password1',
    username: 'Username1',
  },
];

app.post('/api/login', (req, res) => {
  const { login, password } = req.body;

  const user = users.find(
    (user) => user.login === login && user.password === password
  );

  if (user) {
    const token = jwt.sign({ username: user.username }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    return res.json({ token });
  }

  return sendUnauthorizedRes(res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
