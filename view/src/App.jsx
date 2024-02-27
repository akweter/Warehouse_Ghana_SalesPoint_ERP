// import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import ThemeRoutes from './routes';
// import MainRoutes from './routes/MainRoutes';
// import themes from 'themes';
import theme from './themes';
import NavigationScroll from './layout/NavigationScroll';
// import AutoSignout from './auth/setTimeOut';

const App = () => {
  // const [userActive, setUserActive] = useState(true);
  const customization = useSelector((state) => state.customization);

  // const handleLogout = () => {
  //   window.location.href='/auth/logout';
  // };

  // useEffect(() => {
  //   let timeoutId;

  //   const resetUserActivity = () => {
  //     clearTimeout(timeoutId);
  //     timeoutId = setTimeout(() => {
  //       setUserActive(false);
  //     }, 15 * 60 * 1000);
  //   };

  //   const handleUserActivity = () => {
  //     setUserActive(true);
  //     resetUserActivity();
  //   };

  //   // Initial setup
  //   resetUserActivity();

  //   // Event listeners for user activity
  //   window.addEventListener('mousemove', handleUserActivity);
  //   window.addEventListener('keydown', handleUserActivity);

  //   // Cleanup event listeners
  //   return () => {
  //     clearTimeout(timeoutId);
  //     window.removeEventListener('mousemove', handleUserActivity);
  //     window.removeEventListener('keydown', handleUserActivity);
  //   };
  // }, []);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme(customization)}>
        <CssBaseline />
        <NavigationScroll>
        {/* {
          userActive ?
          (< ThemeRoutes />) :
          (<AutoSignout onLogout={handleLogout} /> )
        } */}
        < ThemeRoutes />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
