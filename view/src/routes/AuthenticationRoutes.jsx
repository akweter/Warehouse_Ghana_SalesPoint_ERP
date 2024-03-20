import MinimalLayout from '../layout/MinimalLayout';

// login option 3 routing
import Login from '../auth/login';
import VerifyEmail from 'auth/verifyEmail';
import ShowEmail from 'auth//emailSent';
import VerifyToken from 'auth/activateUser';
import LogOut from 'auth/logout';
import ProtectedRoute from 'auth/protectedRoute';
import ForbiddenPage from 'auth/forbidden';
import NullPage from 'views/pages/nullPage';
// import AutoSignout from 'auth/setTimeOut';

const AuthenticationRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    { path: '/auth/login', element: <Login />},
    { path: '*', element: <NullPage />},
    { path: '/auth/verify/:id', element: <VerifyEmail />},
    { path: '/auth/verify/', element: <ShowEmail />},
    { path: '/activate', element:  <VerifyToken />},
    { path: '/auth/logout', element: <ProtectedRoute> <LogOut /> </ProtectedRoute>},
    { path: '/403', element: <ProtectedRoute> <ForbiddenPage /> </ProtectedRoute>},
  ]
};

export default AuthenticationRoutes;
