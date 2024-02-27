import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const logSuccess = sessionStorage.getItem('usrlogstat');
  useEffect(()=>{
    if (!logSuccess || logSuccess !== '200') {
      window.location.href="/auth/login"
    }
    // return children;
  }, [logSuccess]);
  return logSuccess === '200' ? children : null;
}
export default ProtectedRoute;
