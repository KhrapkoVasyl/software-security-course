// axios({ TODO
// method: 'post',
// url: '/api/refresh-tokens',
// data: { refreshToken },
// }).then((response) => {
// console.log('\n\nResponse: ', response, '\n\n');
// console.log('\n\nResponse data: ', response.data, '\n\n');
// });

const session = sessionStorage.getItem('session');

let accessToken;
let refreshToken;

try {
  const tokens = JSON.parse(session);
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
} catch {}

if (accessToken) {
  console.log(accessToken);
  axios
    .get('/', {
      headers: {
        Authorization: accessToken,
      },
    })
    .then((response) => {
      const { email } = response.data;

      console.log('Response: ', response);
      if (email) {
        const mainHolder = document.getElementById('main-holder');
        const loginHeader = document.getElementById('login-header');

        loginForm.remove();
        loginErrorMsg.remove();
        loginHeader.remove();
        registrationLink.remove();

        let messageToAppend = `You are currently logged in with email:  ${email}`;

        mainHolder.append(messageToAppend);
        logoutLink.style.opacity = 1;
      }
    });
}

const loginForm = document.querySelector('.form');
const loginButton = document.querySelector('.form-submit');
const loginErrorMsg = document.querySelector('.error-msg');
const logoutLink = document.getElementById('logout');
const registrationLink = document.getElementById('registration-link');

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
      // setTimeout(() => location.reload(), 10000); For demonstration
    })
    .catch(() => {
      loginErrorMsg.style.opacity = 1;
    });
});
