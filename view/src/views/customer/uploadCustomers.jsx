/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {    
    Box,    
    DialogContent,
    DialogActions,
    Slider,    
    Button,
	Grid,
	TextField,
	Typography,
	FormControl,
	CircularProgress,
	FormControlLabel,
	Checkbox,
	AppBar,
	Toolbar,
	Dialog,
	IconButton,
    Slide,
    Stack,
    Rating,
} from '@mui/material';
import { AlertError } from '../../utilities/errorAlert';
import Upload from '../../assets/images/Upload.webp';
import { IconEraser } from '@tabler/icons';
import { CancelSharp, Delete, Edit } from '@mui/icons-material';
import Papa from 'papaparse';
import CustomerTemplate from './customerTemplate';
import { postCustomer } from '../../apiActions/allApiCalls/customer';
import { verifyTIN } from '../../apiActions/allApiCalls/invoice';

const UploadCustomers = ({ setSubmitted }) => {
    const [errors, setErrors] = useState({});
    const [drop, setDrop] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
    const [open, setOpen] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
    const [load, setLoad] = useState(false);
    const [cashCustomer, setCashCustomer] = useState(false);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [formData, setFormData] = useState({
        Email: '',
        Status: 'Active',
        Telephone: '',
        Address: '',
        Destination: 'Local',
        Rating: 1,
        TinGhanaCard: '',
        FullName: '',
        Category: 'Taxable',
    });

    // Set Data Grid according to screens sizes
    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Reqquest Customer TIN
    const TinRequest = async () => {
        if ( 
            formData.TinGhanaCard === "C0000000000" || 
            formData.TinGhanaCard === "" || 
            formData.TinGhanaCard === "E0000000000"
        ) { 
            return setCashCustomer(!cashCustomer);
        }
        setLoad(true);
        try {
            const response = await verifyTIN(formData.TinGhanaCard);
            if (response.status === "SUCCESS") {
                setFormData(prevState => ({ ...prevState, FullName: response.data.name }));                
            } else {
                setCashCustomer(!cashCustomer);
            }
        } catch (error) {
            console.log('');
        }
        setOpenAlert(true);
        setLoad(false);
    }

    // handle Customer excel drop
    const handleDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const csvData = e.target.result;
                const jsonData = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;
                setCustomers(jsonData);
            };
            reader.readAsText(file);
        });
    }, []);
    
    const handleClose = () => {
        setOpen(false);
        setCustomers([]);
        setErrors({});
        setFormData({});
    }

    // handle esxel drop
    const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

    // Validate user input in fields
    const validateField = (name, value) => {
        switch (name) {
            case 'Email':
                const Email = /^[a-zA-Z0-9.\-_-]+@[a-zA-Z0-9.\-_-]+\.[a-zA-Z]{2,}$/;
                return Email.test(value) ? '' : 'Invalid email address';
            // case 'Telephone':
            //     const Telephone = /^[0-9]{10}$/;
            //     return Telephone.test(value) ? '' : 'Telephone should be 10 characters. Alphabet and symbol not allowed!';
            case 'FullName':
                const FullName = /^[A-Za-z._ -]{3,}$/;
                return FullName.test(value) ? '' : 'Full name must be at least 3 characters long!';
            // case 'TinGhanaCard':
            //     const userGhCardTIN = /^[a-zA-Z0-9]{10}$|^[a-zA-Z0-9]{11}$|^[a-zA-Z0-9]{15}$/;
            //     return userGhCardTIN.test(value) ? '' : 'Confirm the length of TIN or Ghana Card again';
            default:
                return '';
        }
    };
    
    // Handle form user input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'FullName') {
            const isFullNameExist = customers.some(customer => customer.FullName.toUpperCase() === value.toUpperCase());
            if (isFullNameExist) {
                setErrors({ ...errors, FullName: 'Customer name exists' });
            } else {
                setErrors({ ...errors, FullName: '' });
            }
        }

        if (name === 'Rating') {
            const numericValue = Number(value);
            setFormData({ ...formData, [name]: numericValue });
        } else {
            const validationError = validateField(name, value);
            setErrors({ ...errors, [name]: validationError });
            setFormData({ ...formData, [name]: value });
        }

        const validationError = validateField(name, value);
        setErrors({ ...errors, [name]: validationError });
        const formValue = value.toUpperCase();
        setFormData({ ...formData, [name]: formValue });
    };

    // handle check inputs
    const changeUserStat = (event) => {
        const { name, checked } = event.target;
        let value;
        
        switch (name) {
            case 'Status':
                value = checked ? 'Inactive' : 'Active';
                break;
            case 'Destination':
                value = checked ? 'Foreign' : 'Local';
                break;
            case 'Category':
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

    // clear customers table state
    // Clear Customers from the state and close dialog
	const clearCustomersData = () => {
		setCustomers([]);
	}

    // Handle add button when clicked
	const handleAdd = () => {
        const validationErrors = {};    
        
        const isFullNameExist = customers.some(customer => customer.FullName.toUpperCase() === formData.FullName.toUpperCase());
        if (isFullNameExist) {
            validationErrors.FullName = 'Customer already exists';
        }
        Object.keys(formData).forEach((name) => {
            const value = formData[name];
            const error = validateField(name, value);
            if (error) {
                validationErrors[name] = error;
            }
        });
    
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) { return }

        if (selectedCustomer) {
            setCustomers([...customers, { ...formData }]);
            setSelectedCustomer(null);
        } else {
            setCustomers([...customers, { ...formData }]);
        }
        // Clear form data after adding the customer
        setFormData({
            Email: '',
            Status: 'Active',
            Telephone: '',
            Address: '',
            Destination: 'Local',
            Rating: 1,
            TinGhanaCard: '',
            FullName: '',
            Category: 'Taxable',
        });
    };
    
    // edit selected row or for data
	const handleEdit = (name) => {
		const editedCustomer = customers.find((cus) => cus.FullName === name);
		setSelectedCustomer(editedCustomer);
		setFormData({
            Email: editedCustomer.Email,
            Status: editedCustomer.Status,
            Telephone: editedCustomer.Telephone,
            Address: editedCustomer.Address,
            Destination: editedCustomer.Destination,
            Rating: editedCustomer.Rating,
            TinGhanaCard: editedCustomer.TinGhanaCard,
            FullName: editedCustomer.FullName,
            Category: editedCustomer.Category,
		});
		const updatedCustomers = customers.filter((cus) => cus.FullName !== name);
		setCustomers(updatedCustomers);
	};

    // When Delete button clicked
	const handleDelete = (name) => {
		const updatedCustomers = customers.filter((cus) => cus.FullName !== name);
		setCustomers(updatedCustomers);
	};

    // Submit form to backend
    const handleFormSubmit = async () => {
        setDrop(true);
        try {
            const response = await postCustomer(customers);
            if (response.status === 'success') {
                setAlert((e) => ({...e, message: `You've done it!`, color: 'success' }));
                setCustomers([]);

                setTimeout(() => {
                    ()=> setSubmitted();
                    setOpen(false);
                }, 1000);
            } 
            else {
                setAlert((e) => ({...e, message: response.message, color: 'error' }));
            }
        }
        catch (error) {
            setAlert((state) => ({...state, message: 'Adding customers failed!', color: 'error' }));
        }
        setOpenAlert(true);
        setDrop(false);
    };
    
    return (
        <>
            <Button
                variant='contained'
                color='inherit'
                size='medium'
                onClick={()=>setOpen(true)}
            >
                Upload Customers
            </Button>
            <Dialog 
                open={open} 
                maxWidth="xl" 
                fullWidth 
                TransitionComponent={Slide} 
                transitionDuration={700}
            >
                {alert.message ? (<AlertError open={openAlert} alert={alert} handleClose={()=>setOpenAlert(false)} />) : null}

                <AppBar style={{ backgroundColor: '#151B4D' }}>
					<Toolbar sx={{ gap: 2 }}>
						<Typography
							variant={isSmallScreen ? 'h6' : "h2"}
							sx={{
								flex: 1,
								textAlign: 'center',
								color: 'white'
							}}
						>
							Add | Update Customer
						</Typography>
						<Grid item>
							<FormControl fullWidth>
								<Stack direction="row" spacing={2}>
									<Button
										onClick={clearCustomersData} 
										fullWidth color='warning' 
										variant="contained" 
										size='small' 
										startIcon={<IconEraser />}
									>
										Clear Customers Table
									</Button>
								</Stack>
							</FormControl>
						</Grid>
						< CustomerTemplate />
						<Grid item>
							<FormControl fullWidth>
								<Stack direction="row" spacing={2}>
									<IconButton
										onClick={handleClose} 
										color='inherit' 
										variant="contained" 
										size='small'
									>
										<CancelSharp color='error'/>
									</IconButton>
								</Stack>
							</FormControl>
						</Grid>
					</Toolbar>
				</AppBar>

                <Grid 
                    container 
                    spacing={2} 
                    padding={3} 
                    minHeight={isSmallScreen ? 500 : 600}
                    marginTop={isSmallScreen ? 2 : 0}
                >
                    <Grid 
                        item xs={12} 
                        lg={8} 
                        justifyContent='stretch' 
                        alignItems='center'
                    >
                        <Typography 
                            variant={isSmallScreen ? 'subtitle1' : 'h3'} 
                            color="darkred" 
                            align='center' 
                            paddingBottom={2}
                        >
                            Upload Excel Bulk Customers
                        </Typography>
                        {customers.length > 0 ? (
                            <div style={{ justifyContent: 'stretch', alignItems: 'center' }} >
                                <table width='100%' border={1}>
                                    <thead style={{ fontWeight: 'bolder' }}>
                                        <tr>
                                            <td>{isSmallScreen ? 'Customer' : 'Customer'}</td>
                                            <td>{isSmallScreen ? 'ID' : 'TIN/Gh Card'}</td>
                                            <td>Category</td>
                                            <td>Email</td>
                                            <td>Destination</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers && customers.map((e) => (<>
                                            <tr key={e.index + 1} style={{ backgroundColor: e.Status !== "Active" ? 'lightgoldenrodyellow' : '' }}>
                                                <td>{e.FullName || ''}</td>
                                                <td>{e.TinGhanaCard || ''}</td>
                                                <td>{e.Category || ''}</td>
                                                <td>{e.Email || ''}</td>
                                                <td>{e.Destination || ''}</td>
                                                <td>
                                                    <Edit
                                                        fontSize='small' 
                                                        onClick={() => handleEdit(e.FullName)} 
                                                        color='primary' 
                                                        sx={{ cursor: 'pointer' }} 
                                                    />
                                                    <Delete
                                                        fontSize='small' 
                                                        onClick={() => handleDelete(e.FullName)} 
                                                        color='error' 
                                                        sx={{ cursor: 'pointer' }} 
                                                    />
                                                </td>
                                            </tr>
                                        </>))}
                                    </tbody>
                                </table>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    size='large'
                                    onClick={handleFormSubmit}
                                    sx={{ marginTop: 2, alignItems: 'center', textAlign: 'center' }}
                                >
                                    {drop ? <CircularProgress open={drop} size='25px' /> : 'Submit'}
                                </Button>								
                            </div>
                        ) : (
                            <div {...getRootProps()} style={{ border: '2px dashed #eee', margin: isSmallScreen ? 0 : '20px', textAlign: 'center' }}>
                                <input {...getInputProps()} />
                                <img src={Upload} alt='click to upload Customer' width="70%" height="70%" />
                            </div>
                        )}
                    </Grid>
                    <Grid item xs={12} lg={4} justifyContent='stretch' alignItems='center'>
                        <DialogContent>
                            <Box>
                                <Typography 
                                    variant={isSmallScreen ? 'subtitle1' : 'h3'} 
                                    color="darkred"
                                    align='center' 
                                    paddingBottom={2}
                                >
                                    Add Single Customer
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <FormControlLabel
                                            label={formData.Status === "Active" ? "Active" : "Inactive"}
                                            control={
                                                <Checkbox
                                                    onChange={changeUserStat}
                                                    color="secondary"
                                                    name='Status'
                                                />
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControlLabel
                                            label={formData.Destination === "Local" ? "Local" : "Foreign"}
                                            control={
                                                <Checkbox
                                                    onChange={changeUserStat}
                                                    color="primary"
                                                    name='Destination'
                                                />
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControlLabel
                                            label={formData.Category === "Taxable" ? "Taxable" : "Exempted"}
                                            control={
                                                <Checkbox
                                                    onChange={changeUserStat}
                                                    color="error"
                                                    name='Category'
                                                />
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            <Rating
                                                name="Rating"
                                                value={Number(formData.Rating)}
                                                onChange={handleInputChange}
                                                precision={1}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={load ? 9 : 12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label="TIN or Ghana Card Number"
                                                required
                                                name="TinGhanaCard"
                                                value={formData.TinGhanaCard}
                                                onChange={handleInputChange}
                                                error={!!errors.TinGhanaCard}
                                                helperText={errors.TinGhanaCard}
                                                onBlur={TinRequest}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <>{load ? (<> <Grid item xs={load ? 3 : 0}><CircularProgress size={22} color='primary'/></Grid></>) : null }</>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label="Full Name"
                                                required
                                                name="FullName"
                                                value={formData.FullName}
                                                onChange={handleInputChange}
                                                error={!!errors.FullName}
                                                helperText={errors.FullName}
                                                disabled={!cashCustomer}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label="Email"
                                                required
                                                name="Email"
                                                value={formData.Email}
                                                onChange={handleInputChange}
                                                error={!!errors.Email}
                                                helperText={errors.Email}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label="Telephone"
                                                required
                                                name="Telephone"
                                                type="number"
                                                value={formData.Telephone}
                                                onChange={handleInputChange}
                                                error={!!errors.Telephone}
                                                helperText={errors.Telephone}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label="Address"
                                                required
                                                name="Address"
                                                value={formData.Address}
                                                onChange={handleInputChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <DialogActions>
                                            <Button 
                                                onClick={handleAdd} 
                                                variant='contained' 
                                                color='warning'
                                                fullWidth
                                            >
                                                Add Customer
                                            </Button>
                                        </DialogActions>
                                    </Grid>
                                </Grid>
                            </Box>
                        </DialogContent>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    );
}
export default UploadCustomers;
