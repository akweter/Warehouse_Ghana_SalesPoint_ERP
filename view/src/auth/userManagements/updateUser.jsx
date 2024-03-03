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
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { ShowBackDrop } from 'utilities/backdrop';
import { AlertError } from 'utilities/errorAlert';

/* eslint-disable */

const UpdateUser = ({ user, closeAddnewUser, setSubmitted }) => {
    const [formData, setFormData] = useState({
        fname: user.Usr_FName || '',
        lname: user.Usr_LName || '',
        username: user.Usr_name || '',
        userPhone: user.Usr_phone || '',
        userType: user.Usr_type || '',
        userDept: user.Usr_dept || '',
        staffID: user.Usr_id || '',
        address: user.Usr_address || '',
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
            case 'userType':
                const userType = /^[a-zA-Z0-9.\-_-]+@[a-zA-Z0-9.\-_-]+\.[a-zA-Z]{2,}$/;
                return userType.test(value) ? '' : 'Invalid email address';
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
            // setDrop(true);
            console.log('updating', formData);
            console.log('incoming', user);
            // const response = await axios.put(``, formData);
            // setTimeout(() => {
            //     if (response.data.message === 'success') {
            //         setAlert({ message: `User ${formData.username} updated successfully`, color: 'success' });
            //         setOpenAlert(true);

            //         setTimeout(() => {
            //             setSubmitted(true);
            //             closeAddnewUser();
            //             setFormData({
            //                 fname: '',
            //                 lname: '',
            //                 staffID: '',
            //                 userDept: '',
            //                 userType: '',
            //                 username: '',
            //                 userPhone: '',
            //             });
            //             setDrop(true);
            //         }, 2000);
            //     }
            //     else {
            //         setDrop(false);
            //         setAlert({
            //             message: response.data.message,
            //             color: 'error',
            //         });
            //     }
            // }, 500)
        }
        catch (error) {
            setAlert({
                message: 'Oops! Something went wrong. Please refresh and retry',
                color: 'error',
            });
        }
    };

    return (
        <>
            {alert.message ? (<AlertError open={openAlert} alert={alert} />) : null}
            {drop === true ? <ShowBackDrop open={drop} /> : null}
            <DialogContent>
                <Box>
                    <Typography variant='h3' align='center' paddingBottom={2}>
                        Updating <i style={{ color: 'darkred', backgroundColor: '#E5E6E7', fontSize: 18 }}>
                            {user.Usr_name ? user.Usr_name : user.Usr_email}
                        </i>
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="First Name"
                                    required
                                    name="fname"
                                    value={formData.fname || 'Unavailable'}
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
                                    value={formData.lname || 'Unavailable'}
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
                                    disabled={true}
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
                                    value={formData.userPhone || 0}
                                    onChange={handleInputChange}
                                    error={!!errors.userPhone}
                                    helperText={errors.userPhone}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>User Type</InputLabel>
                                <Select
                                    name="userType"
                                    required
                                    value={formData.userType}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="admin">Admin | Consultant</MenuItem>
                                    <MenuItem value="superAdmin">Admin Overall</MenuItem>
                                    <MenuItem value="default">Default</MenuItem>
                                    <MenuItem value="guest">Guest</MenuItem>
                                    <MenuItem value="intern">Intership & Service</MenuItem>
                                    <MenuItem value="CSM">Support</MenuItem>
                                    <MenuItem value="temporal">Temporal</MenuItem>
                                </Select>
                            </FormControl>
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
                                    <MenuItem value="hr">Human Resource</MenuItem>
                                    <MenuItem value="IT">Information Technology</MenuItem>
                                    <MenuItem value="legal">Legal</MenuItem>
                                    <MenuItem value="logistic">Logistics & Supply</MenuItem>
                                    <MenuItem value="marketing">Marketing & Advertisement</MenuItem>
                                    <MenuItem value="procurement">Procurement</MenuItem>
                                    <MenuItem value="pr">Public Relation</MenuItem>
                                    <MenuItem value="sales">Sales</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Staff ID"
                                    required
                                    name="staffID"
                                    value={formData.staffID || 'Unavailable'}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="GPS Address"
                                    required
                                    name="address"
                                    value={formData.address || 'Unavailable'}
                                    onChange={handleInputChange}
                                    error={!!errors.address}
                                    helperText={errors.address}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleFormSubmit} variant='contained' color='primary' fullWidth>Update</Button>
                <Button onClick={closeAddnewUser} variant='outlined' color='error'>Cancel</Button>
            </DialogActions>
        </>
    );
}

export default UpdateUser;