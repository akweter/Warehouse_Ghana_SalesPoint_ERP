import React, { useState } from 'react';
import { 
    Button, 
    Snackbar, 
    Container, 
    CssBaseline, 
    TextField, 
    Grid, 
    Box, 
    CircularProgress 
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { bcndOrigin, viewOrigin } from 'auth/origins';

/* eslint-disable */

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignInForm() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState({ email: '', passwrd: '' });
    const [errors, setErrors] = useState({});
    const [loginStatus, setloginStatus] = useState('');

    const validateEmailOrUser = (value) => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const userRegex = /^[A-Za-z0-9.]{4,}$/;
        if (emailRegex.test(value) || userRegex.test(value)) { return ''; }
        return 'Invalid username or email address';
    };
    
    const validatePassword = (value) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%^&*_\-+=?]).{6,}$/
        if (passwordRegex.test(value)) { return ''; }
        return 'Invalid password';
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
        setLoading(true);
        setloginStatus(null);

        const url = `${bcndOrigin}/auth/login`;
        const data = JSON.stringify(userId);

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: data,
        })
            .then(response => {
                if (!response.ok) {
                    setloginStatus(`Ooops! Something went wrong. Please refresh and retry`);
                    setLoading(false);
                    return;
                } else {
                    const t = response.headers.get('Authorization');
        
                    response.json().then(body => {
                        if (body.statusMessage === 'successLogin') { 
                            setloginStatus('Success');
                            setTimeout(() => {
                                sessionStorage.setItem('userInfo', JSON.stringify(body.data));
                                sessionStorage.setItem('usrlogstat', response.status);
                                sessionStorage.setItem('Authorization', t);
                                const redirectUrl = sessionStorage.getItem('userActiveURL');
                                if (redirectUrl === null || redirectUrl === undefined || redirectUrl === "") {
                                    window.location.href="/";
                                } else {
                                    window.location.href=`${viewOrigin}${redirectUrl}`;
                                }
                            }, 1000);
                        }
                        else if (body.message === 'email_sent') {
                            window.location.href = '/auth/verify';
                        }
                        else {
                            setloginStatus(body.message);
                            setUserId({ passwrd: '' });
                            setOpen(true);
                            return;
                        }
                    });
                }
            })
            .catch(error => {
                setloginStatus(`Ooops! Something went wrong. Please refresh and retry`);
                setLoading(false);
            })
            .finally(() => {
                setLoading(false);
            });        
    };

    return (<>
        <div style={{textAlign: 'center'}}>
            {
                loginStatus ?
                (<div style={{marginBottom: '10px'}}>
                    <Snackbar 
                        open={open} 
                        autoHideDuration={5000} 
                        onClose={handleClose} 
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
                        sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                        {loginStatus}
                        </Alert>
                    </Snackbar>
                </div>) :
                (loading ? <CircularProgress size={30}/> : null)
            }
        </div>
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
                        <Button 
                            style={{color: 'red', fontWeight: '500', 
                            fontSize: '16px'}} 
                            variant='outlined' 
                            size='large'
                            type='button'
                            onClick={handleSubmit}>Submit
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    </>);
}
