import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../views/pages/AuthWrapper1';
import AuthCardWrapper from '../views/pages/AuthCardWrapper';
import Logo from '../ui-component/Logo';
import SignInForm from './signInForm';

const Login = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        // Check if the page has already been reloaded
        const hasReloaded = sessionStorage.getItem('hasReloaded');

        if (!hasReloaded) {
            sessionStorage.setItem('hasReloaded', 'true');
            window.location.reload();
        }
    }, []);

    return (
        <AuthWrapper1>
            <Grid
                container
                direction="column"
                justifyContent="flex-end"
                sx={{ minHeight: '100vh' }}
            >
                <Grid item xs={12} sx={{ mb: 8 }}>
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        sx={{ minHeight: 'calc(100vh - 68px)' }}
                    >
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid
                                    container
                                    spacing={2}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Grid item>
                                        <Link to="#"><Logo /></Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center">
                                                    <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>Log In</Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <SignInForm />
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            item
                                            container
                                            direction="column"
                                            alignItems="center"
                                            xs={12}
                                        >
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Login;
