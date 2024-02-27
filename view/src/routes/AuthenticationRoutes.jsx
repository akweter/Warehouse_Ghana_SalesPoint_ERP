import MinimalLayout from '../layout/MinimalLayout';

// login option 3 routing
import Register from '../auth/secure/signup';
import Login from '../auth/secure/login';
import VerifyEmail from 'auth/verifyEmail';
import VerifyToken from 'auth/activateUser';
import LogOut from 'auth/logout';
import ProtectedRoute from 'auth/routes';
import ForbiddenPage from 'auth/secure/forbidden';
// import AutoSignout from 'auth/setTimeOut';

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    { path: '/auth/login', element: <Login />},
    { path: '/auth/addnewuser', element:<Register />},
    { path: '/auth/verify', element: <VerifyEmail />},
    { path: '/activate', element:  <VerifyToken />},
    { path: '/auth/logout', element: <ProtectedRoute> <LogOut /> </ProtectedRoute>},
    { path: '/403', element: <ProtectedRoute> <ForbiddenPage /> </ProtectedRoute>},
  ]
};

export default AuthenticationRoutes;
