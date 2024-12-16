import LogOut from "./logout";

function ProtectedRoute({ children }) {
    const logSuccess = localStorage.getItem('usrlogstat');
    if (!logSuccess || logSuccess !== '200') {
        LogOut();
    }
    return logSuccess === '200' ? children : null;
}
export default ProtectedRoute;
