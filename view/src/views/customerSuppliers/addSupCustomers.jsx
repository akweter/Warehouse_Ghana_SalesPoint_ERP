
import React, { useState } from 'react';
import {
    Typography,
    Box,
    Button,
    DialogContent,
    DialogActions,
    Grid,
    FormControl,
    TextField,
    FormControlLabel,
    Checkbox,
    InputLabel,
    Select,
    MenuItem,
    Slider,
} from '@mui/material';
import { ShowBackDrop } from 'utilities/backdrop';
import { AlertError } from 'utilities/errorAlert';
import requestMaking from 'auth/setHeaderToken';

/* eslint-disable */

const AddSupnCustomers = ({ closeAddnewUser, setSubmitted }) => {
    const [errors, setErrors] = useState({});
    const [drop, setDrop] = useState(false);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [openAlert, setOpenAlert] = useState(false);
    const [formData, setFormData] = useState({
        userEmail: '',
        userActive: 'Active',
        userPhone: '',
        userAddress: '',
        userRegion: 'Local',
        userType: '',
        userRating: '',
        userTIN: '',
        userName: '',
        userExemption: 'Taxable',
    });

    // Validate user input in fields
    const validateField = (name, value) => {
        switch (name) {
            case 'userEmail':
                const userEmail = /^[a-zA-Z0-9.\-_-]+@[a-zA-Z0-9.\-_-]+\.[a-zA-Z]{2,}$/;
                return userEmail.test(value) ? '' : 'Invalid email address';
            case 'userPhone':
                const userPhone = /^[0-9]{10}$/;
                return userPhone.test(value) ? '' : 'Telephone should be 10 characters. Alphabet and symbol not allowed!';
            case 'userName':
                const userName = /^[A-Za-z._ -]{4,}$/;
                return userName.test(value) ? '' : 'Full name must be at least 4 characters long!';
            case 'userTIN':
                const userTIN = /^[A-Za-z0-9-]{10,}$/;
                return userTIN.test(value) ? '' : 'TIN must be at least 10 characters long!';
            default:
                return '';
        }
    };

    // Handle form user input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const validationError = validateField(name, value);
        setErrors({ ...errors, [name]: validationError });
        setFormData({ ...formData, [name]: value });
    };

    // handle check inputs
    const changeUserStat = (event) => {
        const { name, checked } = event.target;
        let value;
        
        switch (name) {
            case 'userActive':
                value = checked ? 'Inactive' : 'Active';
                break;
            case 'userRegion':
                value = checked ? 'Foreign' : 'Local';
                break;
            case 'userExemption':
                value = checked ? 'Exempted' : 'Taxable';
                break;
            default:
                value = '';
        }
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    // Submit form to backend
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
            setDrop(true);
            const response = await requestMaking('/auth/signup', 'POST', formData);
            setTimeout(() => {
                if (response.data.message === 'email_sent') {
                    setAlert((e) => ({...e, message: `Email sent to ${formData.userEmail}`, color: 'success' }));
                    setOpenAlert(true);
                    setTimeout(() => {
                        setSubmitted(true);
                        closeAddnewUser();
                        setFormData((e) => ({
                            ...e,
                            userEmail: '',
                            userActive: '',
                            userPhone: '',
                            userAddress: '',
                            userRegion: '',
                            userType: '',
                            userRating: '',
                            userTIN: '',
                            userName: '',
                        }));
                        setDrop(true);
                    }, 2000);
                }
                else {
                    setDrop(false);
                    setAlert((e) => ({...e, message: response.data.message, color: 'error' }));
                }
            }, 1000);
        }
        catch (error) {
            setAlert({ message: 'Ooops! Something went wrong. Please refresh and retry', color: 'error' });
        }
    };

    console.log(formData);
    
    return (
        <>
            {alert.message ? (<AlertError open={openAlert} alert={alert} />) : null}
            {drop ? <ShowBackDrop open={drop} /> : null}
            <DialogContent>
                <Box>
                    <Typography variant='h3' color="darkred" align='center' paddingBottom={2}>
                        Add New Supplier or Customer
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <FormControlLabel
                                label={formData.userActive === "Active" ? "Active" : "Inactive"}
                                control={
                                    <Checkbox
                                        onChange={changeUserStat}
                                        color="secondary"
                                        name='userActive'
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                label={formData.userRegion === "Local" ? "Local" : "Foreign"}
                                control={
                                    <Checkbox
                                        onChange={changeUserStat}
                                        color="primary"
                                        name='userRegion'
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                label={formData.userExemption === "Taxable" ? "Taxable" : "Exempted"}
                                control={
                                    <Checkbox
                                        onChange={changeUserStat}
                                        color="success"
                                        name='userExemption'
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                Rating
                                <Slider
                                    min={0} 
                                    max={5} 
                                    defaultValue={3}
                                    onChange={handleInputChange}
                                    valueLabelDisplay='on'
                                    name='userRating'
                                    color='error'
                                    error={!!errors.userRating}
                                    helperText={errors.userRating}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={7}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Full Name"
                                    required
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                    error={!!errors.userName}
                                    helperText={errors.userName}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                            <FormControl fullWidth>
                                <TextField
                                    label="TIN or ID Number"
                                    required
                                    name="userTIN"
                                    value={formData.userTIN}
                                    onChange={handleInputChange}
                                    error={!!errors.userTIN}
                                    helperText={errors.userTIN}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={7}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Email"
                                    required
                                    name="userEmail"
                                    value={formData.userEmail}
                                    onChange={handleInputChange}
                                    error={!!errors.userEmail}
                                    helperText={errors.userEmail}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Telephone"
                                    required
                                    name="userPhone"
                                    type="number"
                                    value={formData.userPhone}
                                    onChange={handleInputChange}
                                    error={!!errors.userPhone}
                                    helperText={errors.userPhone}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={7}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Address"
                                    required
                                    name="userAddress"
                                    value={formData.userAddress}
                                    onChange={handleInputChange}
                                    error={!!errors.userAddress}
                                    helperText={errors.userAddress}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                            <FormControl fullWidth>
                                <InputLabel>User Type</InputLabel>
                                <Select
                                    name="userType"
                                    required
                                    value={formData.userType}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="supplier">Supplier</MenuItem>
                                    <MenuItem value="customer">Customer</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeAddnewUser} variant='outlined' color='error'>Cancel</Button>
                <Button onClick={handleFormSubmit} variant='contained' color='primary'>Submit</Button>
            </DialogActions>
        </>
    );
}
export default AddSupnCustomers;
