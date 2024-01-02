try {
  const session = sessionStorage.getItem('session');
  const tokens = JSON.parse(session);
  accessToken = tokens.accessToken;
  console.log(accessToken);
  if (accessToken) location.replace('/');
  // if (accessToken) setTimeout(() => location.replace('/'), 10000); // For demonstration
} catch {}

const registrationForm = document.querySelector('.form');
const registrationButton = document.querySelector('.form-submit');
const registrationErrorMsg = document.querySelector('.error-msg');

registrationButton.addEventListener('click', (e) => {
  e.preventDefault();
  const email = registrationForm.email.value;
  const password = registrationForm.password.value;

  axios({
    method: 'post',
    url: '/api/registration',
    data: {
      email,
      password,
    },
  })
    .then((response) => {
      sessionStorage.setItem('session', JSON.stringify(response.data));
      location.replace('/');
      // setTimeout(() => location.replace('/'), 10000); // For demonstration
    })
    .catch(() => {
      registrationErrorMsg.style.opacity = 1;
    });
});
