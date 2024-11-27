import React, { useState } from 'react';
import { 
    Button, 
    Container, 
    CssBaseline, 
    TextField, 
    Grid, 
    Box, 
    CircularProgress 
} from '@mui/material';
import { bcndOrigin } from './origins';
import { AlertError } from '../utilities/errorAlert';

/* eslint-disable */

export default function SignInForm() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState({ email: '', passwrd: '' });
    const [errors, setErrors] = useState({});
    const [loginStatus, setloginStatus] = useState({ message: '', color: '' });

    const validateEmailOrUser = (value) => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const userRegex = /^[A-Za-z0-9._-]{4,}$/;
        if (emailRegex.test(value) || userRegex.test(value)) { return ''; }
        return `Minimun of four characters`;
    };
    
    const validatePassword = (value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%^&*_\-+=?]).{6,}$/
        if (passwordRegex.test(value)) { return ''; }
        return `Minimun of Uppercase, Lowercase, Number, and Symbol`;
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserId({ ...userId, [name]: value });
        if (name === 'email') {
            const emailError = validateEmailOrUser(value);
            setErrors({ ...errors, email: emailError });
        }
        if (name === 'passwrd') {
            const passwrdError = validatePassword(value);
            setErrors({ ...errors, passwrd: passwrdError });
        }
    }; 

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();        
        const emailError = validateEmailOrUser(userId.email);
        const passwrdError = validatePassword(userId.passwrd);
    
        if (emailError || passwrdError) {
            setErrors({ email: emailError, passwrd: passwrdError });
            return;
        }           
        const url = `${bcndOrigin}/auth/login`;
        const data = JSON.stringify(userId);

        try {
            setLoading(true);
            const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: data, });
            const t = response.headers.get('Authorization');
            response.json().then(body => {
                if (body.statusMessage === 'successLogin') { 
                    setloginStatus((state) => ({...state, color: 'success', message: 'login succesful. You are being redirected'}));
                    setTimeout(() => {
                        localStorage.setItem('userInfo', JSON.stringify(body.data));
                        localStorage.setItem('usrlogstat', response.status);
                        localStorage.setItem('Authorization', t);
                        const redirectUrl = localStorage.getItem('userActiveURL');
                        if (redirectUrl === null || redirectUrl === undefined || redirectUrl === "") {
                            window.location.href = window.location.origin;
                        } else {
                            window.location.href = `${window.location.origin}${redirectUrl}`;
                        }                                
                    }, 100);
                }
                else if (body.message === 'email_sent') {
                    window.location.href = '/auth/verify';
                }
                else {
                    setloginStatus((state) => ({...state, color: 'error', message: body.message}));
                    setUserId((state) => ({...state, passwrd: '', email: state.email }));
                }
            });
        } catch (error) {
            setloginStatus((state) => ({...state, color: 'error', message: 'Ooops! Something went wrong. Please refresh and retry' }));
        }
        setOpen(true);
        setLoading(false);
    };

    return (
        <>
            <Box justifyContent='center' textAlign='center'>
                {loginStatus.message ? <AlertError alert={loginStatus} handleClose={handleClose} open={open} /> : null}
            </Box>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box component='form' onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Username or email address"
                                name="email"
                                autoComplete="email"
                                value={userId.email}
                                onChange={handleInputChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="passwrd"
                                label="Password"
                                type="password"
                                id="password"
                                value={userId.passwrd}
                                autoComplete="new-password"
                                onChange={handleInputChange}
                                error={!!errors.passwrd}
                                helperText={errors.passwrd}
                            />
                        </Grid>
                        <Grid item xs={12} style={{textAlign: 'center'}}>
                            {loading ? <CircularProgress size={30}/> : <>
                                <Button
                                    sx={{ color: 'red', fontWeight: '500', fontSize: '16px' }}
                                    variant='outlined'
                                    type='submit'
                                    onClick={handleSubmit}> Sign in
                                </Button>
                            </>}
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}
