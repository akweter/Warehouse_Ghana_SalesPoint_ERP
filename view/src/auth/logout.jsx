import { useEffect } from 'react';

export default function LogOut() {
  useEffect(() => {
    const redirectUrl = localStorage.getItem('userActiveURL');
    document.cookie = "";
    localStorage.clear();
    localStorage.clear();
    window.localStorage.setItem('userActiveURL', redirectUrl);
    window.location.href='/auth/login';
  });
}
