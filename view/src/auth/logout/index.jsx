import { useEffect } from 'react';

export default function LogOut() {
  useEffect(() => {
    const redirectUrl = sessionStorage.getItem('userActiveURL');
    document.cookie = "";
    localStorage.clear();
    sessionStorage.clear();
    window.sessionStorage.setItem('userActiveURL', redirectUrl);
    window.location.href='/auth/login';
  });
}
