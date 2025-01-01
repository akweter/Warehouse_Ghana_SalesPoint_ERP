export default function LogOut() {
    const redirectUrl = localStorage.getItem('userActiveURL');
    document.cookie = "";
    window.sessionStorage.setItem('userActiveURL', redirectUrl);
    localStorage.clear();
    window.localStorage.setItem('userActiveURL', redirectUrl);
    sessionStorage.clear();
    window.location.href='/auth/login';
}
