
import { bcndOrigin } from 'auth/origins';
import axios from 'axios';
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
} from '@mui/material';
import { ShowBackDrop } from 'utilities/backdrop';
import { AlertError } from 'utilities/errorAlert';

/* eslint-disable */

const AddSupnCustomers = ({ closeAddnewUser, setSubmitted }) => {
    const [formData, setFormData] = useState({
        username: '',
        userEmail: '',
        userType: 'Active',
        userPhone: '',
        staffID: '',
        userDept: '',
        userVerified: '',
        lname: '',
        fname: '',
    });
    const [errors, setErrors] = useState({});
    const [drop, setDrop] = useState(false);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [openAlert, setOpenAlert] = useState(false);

    const validateField = (name, value) => {
        switch (name) {
            case 'username':
                const userName = /^[A-Za-z0-9._-]{4,}$/;
                return userName.test(value) ? '' : 'Username must be at least 5 characters long. Alphanumeric Required!';
            case 'userEmail':
                const userEmail = /^[a-zA-Z0-9.\-_-]+@[a-zA-Z0-9.\-_-]+\.[a-zA-Z]{2,}$/;
                return userEmail.test(value) ? '' : 'Invalid email address';
            case 'userPhone':
                const userPhone = /^[0-9]{10}$/;;
                return userPhone.test(value) ? '' : 'Telephone should be 10 characters. Alphabet and symbol not allowed!';
            case 'fname':
                const userFName = /^[A-Za-z._-]{2,}$/;
                return userFName.test(value) ? '' : 'First name must be at least 2 characters long.  Numeric not allowed!';
            case 'lname':
                const userLName = /^[A-Za-z -_.]{2,}$/;
                return userLName.test(value) ? '' : 'Last name must be at least 2 characters long.  Numeric not allowed!';
            case 'staffID':
                const staffID = /^[A-Za-z -_.]{2,}$/;
                return staffID.test(value) ? '' : 'Staff ID must be at least 5 characters long. Alphanumeric Required!';
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

    const changeUserStat = () => {
        setFormData({
            ...formData,
            userType: formData.userType === 'Active' ? 'Inactive' : 'Active',
        });
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
            setDrop(true);
            const response = await axios.post(bcndOrigin + '/auth/signup', formData);
            setTimeout(() => {
                if (response.data.message === 'email_sent') {
                    setAlert((e) => ({...e, message: `Email sent to ${formData.userEmail}`, color: 'success' }));
                    setOpenAlert(true);
                    setTimeout(() => {
                        setSubmitted(true);
                        closeAddnewUser();
                        setFormData((e) => ({
                            ...e,
                            fname: '', lname: '', staffID: '', userDept: '', userType: '',
                            userEmail: '', username: '', userPhone: '', userVerified: '',
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

    return (
        <>
            {alert.message ? (<AlertError open={openAlert} alert={alert} />) : null}
            {drop === true ? <ShowBackDrop open={drop} /> : null}
            <DialogContent>
                <Box>
                    <Typography variant='h3' color="darkred" align='center' paddingBottom={2}>
                        Add New User
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="First Name"
                                    required
                                    name="fname"
                                    value={formData.fname}
                                    onChange={handleInputChange}
                                    error={!!errors.fname}
                                    helperText={errors.fname}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Last Name"
                                    required
                                    name="lname"
                                    value={formData.lname}
                                    onChange={handleInputChange}
                                    error={!!errors.lname}
                                    helperText={errors.lname}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Username"
                                    required
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    error={!!errors.username}
                                    helperText={errors.username}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
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
                        <Grid item xs={8}>
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
                        <Grid item xs={4}>
                            <FormControlLabel
                                label={formData.userType === "Active" ? "Active" : "Inactive"}
                                control={
                                    <Checkbox
                                        checked={formData.userType === "Active"}
                                        onChange={changeUserStat}
                                        color="secondary"
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Department</InputLabel>
                                <Select
                                    name="userDept"
                                    required
                                    value={formData.userDept}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="accounts">Accounts</MenuItem>
                                    <MenuItem value="procurement">Procurement</MenuItem>
                                    <MenuItem value="sales">Sales</MenuItem>
                                    <MenuItem value="marketing">Marketing & Advertisement</MenuItem>
                                    <MenuItem value="hr">Human Resource</MenuItem>
                                    <MenuItem value="legal">Legal</MenuItem>
                                    <MenuItem value="logistic">Logistics & Supply</MenuItem>
                                    <MenuItem value="IT">Information Technology</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Staff ID"
                                    required
                                    name="staffID"
                                    value={formData.staffID}
                                    onChange={handleInputChange}
                                />
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