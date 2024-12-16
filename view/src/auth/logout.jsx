export default function LogOut() {
    const redirectUrl = localStorage.getItem('userActiveURL');
    document.cookie = "";
    localStorage.clear();
    sessionStorage.clear();
    window.localStorage.setItem('userActiveURL', redirectUrl);
    window.location.href='/auth/login';
}
