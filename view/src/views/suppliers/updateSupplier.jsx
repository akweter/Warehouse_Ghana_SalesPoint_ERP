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
    Slider,
    CircularProgress,
} from '@mui/material';
import { ShowBackDrop } from '../../utilities/backdrop';
import { AlertError } from '../../utilities/errorAlert';
import { updateSupplier } from '../../apiActions/allApiCalls/supplier';

/* eslint-disable */

const UpdateSupplier = ({ supplier, closeAddnewUser, setSubmitted }) => {
    const [formData, setFormData] = useState({
        userEmail: supplier.supplierEmail || '',
        userActive: supplier.supplierStatus || '',
        userPhone: supplier.supplierPhone || '',
        userAddress: supplier.supplierAddress || '',
        userRegion: supplier.supplierRegion || '',
        userRating: supplier.supplierRating || '',
        userTIN: supplier.supplierTin || '',
        userName: supplier.supplierName || '',
        userExemption: supplier.supplierExempted || '',
        userAddedDate: supplier.supplierAddedDate || new Date(),
    });
    const [errors, setErrors] = useState({});
    const [drop, setDrop] = useState(false);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [openAlert, setOpenAlert] = useState(false);

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
            // case 'userTIN':
            //     const userGhCardTIN = /^(P00|C00)[0-9xX]{8}$|^GHA-[0-9xX]{9}-?[0-9xX]?$/;
            //     return userGhCardTIN.test(value) ? '' : 'Invalid TIN or Ghana Card number';
            default:
                return '';
        }
    };

    // Change user change
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
                value = checked ? 'Active' : 'Inactive';
                break;
            case 'userRegion':
                value = checked ? 'Local' : 'Foreign';
                break;
            case 'userExemption':
                value = checked ? 'Taxable' : 'Exempted';
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
        Object.keys(formData).forEach((name) => {
            const value = formData[name];
            const error = validateField(name, value);
            if (error) {
                validationErrors[name] = error;
            }
        });
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) { return }
        
        try {
            setDrop(true);
            const response = await updateSupplier(supplier.supplierID, formData);
            setTimeout(() => {
                if (response.message === 'success') {
                    setTimeout(() => {
                        setAlert({ message: `${formData.userName || formData.userEmail} updated successfully`, color: 'success' });
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
                                userRating: '',
                                userTIN: '',
                                userName: '',
                                userExemption: '',
                            }));
                            setDrop(true);
                        }, 1000);
                    }, 2000);
                }
                else {
                    setDrop(false);
                    setAlert({ message: response.message, color: 'error' });
                }
            }, 500)
        }
        catch (error) {
            setDrop(false);
            setAlert({
                message: 'Oops! Something went wrong. Please refresh and retry',
                color: 'error',
            });
        }
    };

    return (
        <>
            {alert.message ? (<AlertError open={openAlert} alert={alert} />) : null}
            {drop ? <ShowBackDrop open={drop} /> : null}
            <DialogContent>
                <Box>
                    <Typography variant='h4' color="darkred" align='center' paddingBottom={2}>
                       You are Updating <i style={{color: 'darkblue'}}>{formData.userName ? formData.userName || formData.userEmail : formData.userName}</i>
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
                                        value={formData.userActive || ""}
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
                                        value={formData.userRegion || ""}
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
                                        color="error"
                                        name='userExemption'
                                        value={formData.userExemption || ""}
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
                                    value={formData.userRating || 0}
                                    onChange={handleInputChange}
                                    valueLabelDisplay='on'
                                    name='userRating'
                                    color='success'
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
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeAddnewUser} variant='outlined' color='error'>Cancel</Button>
                <Button onClick={handleFormSubmit} variant='outlined' color='primary'>{drop ? <CircularProgress open={drop} size='25px' /> : 'Update'}</Button>
            </DialogActions>
        </>
    );
}

export default UpdateSupplier;