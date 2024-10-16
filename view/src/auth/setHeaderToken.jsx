import { bcndOrigin } from "./origins";

const headerToken = () => {
  const token = sessionStorage.getItem('Authorization');
  return token ? token : null;
};

const requestMaking = async (route, method, bodyData) => {
  const url = `${bcndOrigin}/${route}`;
  const token = headerToken();

  const response = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : null,
    },
    body: bodyData ? JSON.stringify(bodyData) : null,
  });

  if (response.status === 401) {
    sessionStorage.setItem('userActiveURL', window.location.pathname);
    window.location.href = "/403";
  }
  if (response.ok) {
    const newToken = response.headers.get('Authorization');
    if (newToken) {
      sessionStorage.setItem('Authorization', newToken);
      sessionStorage.setItem('userActiveURL', window.location.pathname);
    }
  }
  return response;
};

export default requestMaking;
