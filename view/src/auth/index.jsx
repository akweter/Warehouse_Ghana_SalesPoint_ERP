import { Navigate } from 'react-router-dom';
import LogOut from './logout';
export default function Auth(){
    const logSuccess = localStorage.getItem('usrlogstat');
    if (logSuccess || logSuccess === '200') {
        <Navigate to="/" />;
    }
        < LogOut />
}
