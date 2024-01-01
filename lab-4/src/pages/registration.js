const session = sessionStorage.getItem('session');

let token;

try {
  token = JSON.parse(session).token;
} catch {}

if (token) {
  // redirect to log in TODO
}

const registrationForm = document.querySelector('.form');
const registrationButton = document.querySelector('.form-submit');
const registrationErrorMsg = document.querySelector('.error-msg');

registrationButton.addEventListener('click', (e) => {
  e.preventDefault();
  const login = registrationForm.login.value;
  const password = registrationForm.password.value;

  axios({
    method: 'post',
    url: '/api/registration',
    data: {
      login,
      password,
    },
  })
    .then((response) => {
      sessionStorage.setItem('session', JSON.stringify(response.data));
      // location.reload();
      // redirect to log in TODO
    })
    .catch(() => {
      registrationErrorMsg.style.opacity = 1;
    });
});
