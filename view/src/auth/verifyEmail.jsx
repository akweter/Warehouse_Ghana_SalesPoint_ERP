/* eslint-disable */
import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo.webp';
import { fetchuserByIDPsd, updateUserPSD } from '../apiActions/allApiCalls/users';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { IconExclamationMark } from '@tabler/icons';
import { AlertError } from '../utilities/errorAlert';

const VerifyEmail = () => {
    const [userData, setUserData] = useState([]);
    const [formData, setFormData] = useState({ psd: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const id = window.location.pathname.split('/').pop();
            const data = await fetchuserByIDPsd(id);
            setUserData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'psd':
                const psd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%^&*_\-+=?]).{6,}$/;
                return psd.test(value)
                    ? ''
                    : 'Password should be alphanumeric, at least 6 characters long with an uppercase letter and a symbol';
            case 'cfmpasd':
                return value !== formData.psd ? 'Password mismatch' : '';
            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const validationError = validateField(name, value);
        setErrors({ ...errors, [name]: validationError });
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        Object.keys(formData).forEach((name) => {
            const value = formData[name];
            const error = validateField(name, value);
            if (error) {
                validationErrors[name] = error;
            }
        });
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        try {
            setLoading(true);
            const response = await updateUserPSD(userData[0].accountId, formData);
            console.log('response', response);
            if (response.status === 'success') {
                setAlert({ message: `${userData[0].primaryEmail} activated successfully! Please login`, color: 'success' });
                setOpenAlert(true);
                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 4000);
            } else {
                setLoading(false);
                setAlert({ message: response.data.message, color: 'error' });
            }
        } catch (error) {
            setAlert({ message: 'Oops! Something went wrong. Please refresh and retry.', color: 'error' });
        }
    };

    return (
        <>
            {alert.message && <AlertError open={openAlert} alert={alert} />}
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 2,
                }}
            >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <img src={logo} alt="Warehouse Ghana Logo" width="50" />
                    <Typography variant="h6" sx={{ mt: 1 }}>Warehouse Ghana</Typography>
                </Box>
                <Typography variant="h4" gutterBottom>Verification Successful</Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>Please set up your password to activate your account.</Typography>

                {userData.length > 0 && (
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 600,
                            p: 3,
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            boxShadow: 3,
                            backgroundColor: '#fff',
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Username"
                                        value={userData[0].userName || ''}
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Email"
                                        value={userData[0].primaryEmail || ''}
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Password"
                                        name="psd"
                                        type="password"
                                        value={formData.psd}
                                        onChange={handleInputChange}
                                        error={!!errors.psd}
                                        helperText={errors.psd}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Confirm Password"
                                        name="cfmpasd"
                                        type="password"
                                        onChange={handleInputChange}
                                        error={!!errors.cfmpasd}
                                        helperText={errors.cfmpasd}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            color="primary"
                                            onClick={handleFormSubmit}
                                        >
                                            {loading ? <CircularProgress size={24} /> : 'Proceed'}
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            color="error"
                                            onClick={() => window.alert(`Kindly retry logging in`)}
                                        >
                                            <IconExclamationMark />
                                            Report Issue
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Box>
        </>
    );
};

export default VerifyEmail;
