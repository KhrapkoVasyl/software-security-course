const session = sessionStorage.getItem('session');

let token;

try {
  token = JSON.parse(session).token;
} catch {}

if (token) {
  console.log(token);
  axios
    .get('/', {
      headers: {
        Authorization: token,
      },
    })
    .then((response) => {
      const { username, expDate } = response.data;

      console.log('Response: ', response);
      if (username) {
        const mainHolder = document.getElementById('main-holder');
        const loginHeader = document.getElementById('login-header');

        loginForm.remove();
        loginErrorMsg.remove();
        loginHeader.remove();

        let messageToAppend = expDate
          ? `Hello ${username}. Expiration date: ${expDate}`
          : `Hello ${username}`;

        mainHolder.append(messageToAppend);
        logoutLink.style.opacity = 1;
      }
    });
}

const loginForm = document.querySelector('.form');
const loginButton = document.querySelector('.form-submit');
const loginErrorMsg = document.querySelector('.error-msg');
const logoutLink = document.getElementById('logout');

logoutLink.addEventListener('click', (e) => {
  e.preventDefault();
  sessionStorage.removeItem('session');
  location.reload();
});

loginButton.addEventListener('click', (e) => {
  e.preventDefault();
  const login = loginForm.login.value;
  const password = loginForm.password.value;

  axios({
    method: 'post',
    url: '/api/login',
    data: {
      login,
      password,
    },
  })
    .then((response) => {
      sessionStorage.setItem('session', JSON.stringify(response.data));
      location.reload();
    })
    .catch((response) => {
      loginErrorMsg.style.opacity = 1;
    });
});
