const session = sessionStorage.getItem('session');

let accessToken;
let refreshToken;

try {
  const tokens = JSON.parse(session);
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
} catch {}

if (accessToken && refreshToken) {
  location.replace('/profile');
}

const loginForm = document.querySelector('.form');
const loginButton = document.querySelector('.form-submit');
const loginErrorMsg = document.querySelector('.error-msg');

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
      location.replace('/profile');
      // setTimeout(() => location.replace('/profile'), 10000); For demonstration
    })
    .catch(() => {
      loginErrorMsg.style.opacity = 1;
    });
});
