import { bcndOrigin } from "./origins";

const headerToken = () => {
  const token = localStorage.getItem('Authorization');
  return token ? token : null;
};

const requestMaking = async (route, method, bodyData) => {
  const url = `${bcndOrigin}/${route}`;
  const token = headerToken();

  // Retrieve the userInfo from localStorage and parse it
  const userInfo = localStorage.getItem('userInfo');
  let accountId = null;

  if (userInfo) {
    const parsedUserInfo = JSON.parse(userInfo);
    accountId = parsedUserInfo.accountId;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : null,
  };
  if (accountId) {
    headers['keyID'] = accountId;
  }

  const response = await fetch(url, {
    method: method,
    headers: headers,
    body: bodyData ? JSON.stringify(bodyData) : null,
  });

  if (response.status === 401) {
    localStorage.setItem('userActiveURL', window.location.pathname);
    window.location.href = "/403";
  }
  if (response.ok) {
    const newToken = response.headers.get('Authorization');
    if (newToken) {
      localStorage.setItem('Authorization', newToken);
      localStorage.setItem('userActiveURL', window.location.pathname);
    }
  }
  return response;
};

export default requestMaking;
