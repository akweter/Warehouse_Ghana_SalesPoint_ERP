import { Navigate } from 'react-router-dom';
export default function Auth(){
    const logSuccess = localStorage.getItem('usrlogstat');
    if (logSuccess || logSuccess === '200') {
        <Navigate to="/" />;
    }
        <Navigate to="/auth/login" />;
}
