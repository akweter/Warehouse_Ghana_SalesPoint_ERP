import React, { useState } from 'react';
import { Button, Snackbar, Container, CssBaseline, TextField, Grid, Box, CircularProgress } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { bcndOrigin } from 'auth/origins';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SignUpForm() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ username: '', email: '', psd: '', confirmPsd: '' });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [loginStatus, setloginStatus] = useState('');

    function formatDateAsDDMMYY() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = String(today.getFullYear()).slice(-4);
        return `${year}-${month}-${day}`;
      }
      const Dating = formatDateAsDDMMYY();

    //   Validate username
    const validateUserName = (value) => {
        const userRegex = /^[A-Za-z0-9.]{4,}$/;
        if (userRegex.test(value)) { return ''; }
        return 'Username must be at least 5 characters long. Alphanumeric Required!';
    }

    // Validate email
    const validateEmail = (value) => {
        const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (regexEmail.test(value)) { return ''; }
        return 'Invalid email address';
    }

    // Validate password
    const validatePassword = (value) => {
        const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=]).{6,}$/;
        if (regexPassword.test(value)) { return ''; }
        return 'Password must contain uppercase, lowercase, number, symbol, and at least 6 characters long.';
    }

    // Confirm password
    const confirmPassword = (value) => {
        if (formData.psd !== value)
        return 'Password mismatch';
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'username') {
            const psdError = validateUserName(value);
            setErrors({ ...errors, username: psdError });
        }
        if (name === 'email') {
            const emailError = validateEmail(value);
            setErrors({ ...errors, email: emailError });
        }
        if (name === 'Password') {
            const passwrdError = validatePassword(value);
            setErrors({ ...errors, psd: passwrdError });
        }
        if (name === 'confirmPsd') {
            const passwrdError = confirmPassword(value);
            setErrors({ ...errors, confirmPsd: passwrdError });
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userError = validateUserName(formData.username);
        const psdError = validatePassword(formData.psd);
        const emailError = validateEmail(formData.email);
        const confirmPsdError = confirmPassword(formData.confirmPsd);

        if (userError || psdError || emailError || confirmPsdError) {
            setErrors({
                username: userError,
                email: emailError,
                psd: psdError,
                confirmPsd: confirmPsdError
            });
            return;
        }
        setTouched('');
        setLoading(true);
        setloginStatus(null);

        const payload = {
            username: formData.username,
            email: formData.email,
            psd: formData.psd,
            date: Dating
        };
        axios.post(bcndOrigin+'/auth/signup', payload)
        .then((res) => {
            const response  = res.data;
            // setTimeout(()=>{
                if (response.message === 'email_sent') {
                    setFormData({ username: '', email: '', psd: '', confirmPsd: '' });
                    window.location.href='/auth/verify';
                }
                else{
                    setloginStatus(response.message);
                    setFormData({ username: '', email: '', psd: '', confirmPsd: '' });
                    setOpen(true);
                    return;
                }
            // }, 3000)
        })
        .catch((error) => {
            setloginStatus(`Ooops! Something Went wrong. Please refresh and retry`);
                return;
            })
        .finally(()=>{
            setLoading(false);
            return;
        });
    }

    return (
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
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                    <Box component="form" onSubmit={handleFormSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    error={touched.username || !!errors.username}
                                    helperText={touched.username || errors.username}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    error={touched.email || !!errors.email}
                                    helperText={touched.email || errors.email} 
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="psd"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new password"
                                    value={formData.psd}
                                    onChange={handleInputChange}
                                    error={touched.psd || !!errors.psd}
                                    helperText={touched.psd || errors.psd} 
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmPsd"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirm-password"
                                    autoComplete="new-password"
                                    value={formData.confirmPsd}
                                    onChange={handleInputChange}
                                    error={touched.confirmPsd || !!errors.confirmPsd}
                                    helperText={touched.confirmPsd || errors.confirmPsd} 
                                />
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: 'center' }}>
                                <Button
                                    style={{ color: 'red', fontWeight: '500', fontSize: '16px' }}
                                    variant='outlined'
                                    size='large'
                                    type='button'
                                    onClick={handleFormSubmit}
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
            </Container>
        </div>
    );
}
