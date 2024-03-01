import React, { useState, useEffect } from 'react';
import logo from '../assets/images/logo.webp';
import '../assets/css/verifyEmail.css';
import { fetchuserByID, updateUserPSD } from 'apiActions/allApiCalls/users';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    TextField
} from '@mui/material';
import { IconExclamationMark } from '@tabler/icons';
import { AlertError } from 'utilities/errorAlert';

/* eslint-disable */

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
            const data = await fetchuserByID(id);
            setUserData(data);
        }
        catch (error) {
            console.log(error);
        }
    }

    const validateField = (name, value) => {
        switch (name) {
            case 'psd':
                const psd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%^&*_\-+=?]).{6,}$/;
                return psd.test(value) ? '' : 'Pasword should be alphanumeric, at least 6 character long with Uppercase and Symbol';
            case 'cfmpasd':
                    return (value !== formData.psd) ? 'Password Mismatch' : ''
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
        Object.keys(formData).forEach(async (name) => {
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
            const response = await updateUserPSD(userData[0].Usr_id, formData);
            setTimeout(() => {
                if (response.message === 'success') {
                    setAlert((e) => ({ ...e, message: `${userData[0].Usr_email} activated`, color: 'success' }));
                    setOpenAlert(true);
                    setTimeout(() => {
                        window.location.href='/';
                    }, 500);
                }
                else {
                    setLoading(false);
                    setAlert((e) => ({ ...e, message: response.data.message, color: 'error' }));
                }
            }, 1000);
        }
        catch (error) {
            setAlert({ message: 'Ooops! Something went wrong. Please refresh and retry', color: 'error' });
        }
    };

    return (
        <>
            {alert.message ? (<AlertError open={openAlert} alert={alert} />) : null}
            <div className='body'>
                <div className='imageSection'>
                    <a href='/'>
                        <img src={logo} alt="Warehouse Ghana Logo" width="50" />
                    </a>
                    <i>Warehouse Ghana</i>
                </div>
                <div className='paragraph'>
                    <h1>Verification Successful</h1>
                    <p id='checkSpam'>Please set up your password to activate your account</p>
                    <div id='linkCard'>
                        {userData.length > 0 && (<>
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <TextField  
                                                label="Username"
                                                required
                                                value={userData[0].Usr_name ? userData[0].Usr_name : ""}
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label="Email"
                                                required
                                                value={userData[0].Usr_email ? userData[0].Usr_email : ""}
                                                disabled={true}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label="Password"
                                                required
                                                name="psd"
                                                type='password'
                                                value={formData.psd}
                                                onChange={handleInputChange}
                                                error={!!errors.psd}
                                                helperText={errors.psd}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label="Confirm Password"
                                                required
                                                name="cfmpasd"
                                                type='password'
                                                onChange={handleInputChange}
                                                error={!!errors.cfmpasd}
                                                helperText={errors.cfmpasd}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid container paddingTop={2} spacing={1}>
                                        <Grid item xs={6}>
                                            <Button 
                                                variant='outlined' 
                                                fullWidth 
                                                size='large' 
                                                color='primary' 
                                                onClick={handleFormSubmit}
                                            >
                                                {loading === true ? <CircularProgress size={27}/> : 'Proceed'}
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button 
                                                variant='contained' 
                                                fullWidth 
                                                size='large' 
                                                color='error'
                                                onClick={()=>alert('Issue will be reported soon!')}
                                            >
                                                < IconExclamationMark />Report Issue
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        </>)}
                    </div>
                </div>
            </div>
        </>
    );
}

export default VerifyEmail;