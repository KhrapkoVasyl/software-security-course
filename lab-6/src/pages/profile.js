const retrieveTimeBeforeAccessTokenExpiry = (accessToken) => {
  const payloadBase64 = accessToken.split('.')[1];
  const payloadString = atob(payloadBase64);
  const { exp } = JSON.parse(payloadString);

  const currentTimestamp = Math.floor(Date.now() / 1000);
  return exp - currentTimestamp;
};
const REFRESH_ACCESS_TOKEN_THRESHOLD_SEC = 4 * 60;

const session = sessionStorage.getItem('session');

let accessToken;
let refreshToken;

try {
  const tokens = JSON.parse(session);
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
} catch {}

if (!accessToken || !refreshToken) {
  sessionStorage.removeItem('session');
  location.replace('/login');
}

const errorMsg = document.querySelector('.error-msg');
const logoutLink = document.getElementById('logout');

logoutLink.addEventListener('click', (e) => {
  e.preventDefault();
  sessionStorage.removeItem('session');
  location.replace('/login');
});

(async () => {
  const timeBeforeAccessTokenExpiration =
    retrieveTimeBeforeAccessTokenExpiry(accessToken);

  if (timeBeforeAccessTokenExpiration <= REFRESH_ACCESS_TOKEN_THRESHOLD_SEC) {
    await axios({
      method: 'post',
      url: '/api/refresh-tokens',
      data: { refreshToken },
    })
      .then(({ data }) => {
        accessToken = data.accessToken;
        refreshToken = data.refreshToken;

        sessionStorage.setItem(
          'session',
          JSON.stringify({ accessToken, refreshToken })
        );
      })
      .catch(() => {
        sessionStorage.removeItem('session');
        location.replace('/login');
      });
  }

  await axios
    .get('/api/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      const { email } = response.data;

      if (email) {
        const mainHolder = document.getElementById('main-holder');

        errorMsg.remove();

        const expirationTimeSec =
          retrieveTimeBeforeAccessTokenExpiry(accessToken);

        let currentUserEmailMessage = `You are currently logged in with email:  ${email}`;
        let tokenExpirationMessage = `Time before access token expiration: ${expirationTimeSec} seconds`;
        const p1 = document.createElement('p');
        const p2 = document.createElement('p');
        p1.textContent = currentUserEmailMessage;
        p2.textContent = tokenExpirationMessage;

        mainHolder.append(p1, p2);
        logoutLink.style.opacity = 1;
      }
    })
    .catch((err) => {
      if (err?.response?.status === 401) {
        sessionStorage.removeItem('session');
        location.replace('/login');
        return;
      }
      errorMsg.style.opacity = 1;
      logoutLink.style.opacity = 1;
    });
})();
