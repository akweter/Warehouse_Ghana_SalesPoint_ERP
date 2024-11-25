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
	InputLabel,
	MenuItem,
	Select,
	Typography,
	FormControl,
	Autocomplete,
	CircularProgress,
	FormControlLabel,
	Checkbox,
	AppBar,
	Toolbar,
	Dialog,
	IconButton,
    Slide,
    Stack,
} from '@mui/material';
import { AlertError } from '../../utilities/errorAlert';
import Upload from '../../assets/images/Upload.webp';
import { IconEraser } from '@tabler/icons';
import { CancelSharp } from '@mui/icons-material';


const UploadCustomers = ({ closeAddnewUser, setSubmitted }) => {
    const [errors, setErrors] = useState({});
    const [drop, setDrop] = useState(false);
    const [open, setOpen] = useState(false);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [openAlert, setOpenAlert] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
    const [formData, setFormData] = useState({
        userEmail: '',
        userActive: 'Active',
        userPhone: '',
        userAddress: '',
        userRegion: 'Local',
        userRating: '',
        userTIN: '',
        userName: '',
        userExemption: 'Taxable',
    });

    // Set Data Grid according to screens sizes
    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // handle product excel drop
	const handleDrop = useCallback((acceptedFiles) => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onload = async (e) => {
				const csvData = new TextDecoder('utf-8').decode(e.target.result);
				const jsonData = csvData
					.split('\n')
					.map((row) => row.split(','))
					.filter((row) => row.some((cell) => cell.trim() !== ''))
					.map((row, index) => {
						const [
							Telephone,
							FullName,
							Status,
							Rating,
							Address,
							TinGhanaCard,
							TaxType,
							Email,
                            Destination
						] = row.map((value) => value.trim());
						return {
							key: index,
							Telephone,
							FullName,
							Status,
							Rating,
							Address,
							TinGhanaCard,
							TaxType,
							Email,
                            Destination
						};
					});
				setCustomers(jsonData);
			};
			reader.readAsArrayBuffer(file);
		});
	}, []);

    const handleClose = () => {
        setOpen(false);
        setCustomers([]);
    }

    // handle esxel drop
    const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

    // Validate user input in fields
    const validateField = (name, value) => {
        switch (name) {
            case 'userEmail':
                const userEmail = /^[a-zA-Z0-9.\-_-]+@[a-zA-Z0-9.\-_-]+\.[a-zA-Z]{2,}$/;
                return userEmail.test(value) ? '' : 'Invalid email address';
            // case 'userPhone':
            //     const userPhone = /^[0-9]{10}$/;
            //     return userPhone.test(value) ? '' : 'Telephone should be 10 characters. Alphabet and symbol not allowed!';
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
            if (error) { validationErrors[name] = error }
        });
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) { return }

        try {
            setDrop(true);
            setTimeout(() => {
                setAlert((e) => ({...e, message: `You've done it!`, color: 'success' }));
                setOpenAlert(true);

                setTimeout(() => {
                    setDrop(true);
                    closeAddnewUser();
                    setSubmitted(true);
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
                }, 1000);
            }, 2000);
        }
        catch (error) {
            setAlert({ message: 'Ooops! Something went wrong. Please refresh and retry', color: 'error' });
            setOpenAlert(true);
        }
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
                {alert.message ? (<AlertError open={openAlert} alert={alert} />) : null}

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
										onClick={()=>window.alert('coming soon!')} 
										fullWidth color='warning' 
										variant="contained" 
										size='small' 
										startIcon={<IconEraser />}
									>
										Clear Products
									</Button>
								</Stack>
							</FormControl>
						</Grid>
						{/* < ProductTemplate /> */}
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
                                            <td>{isSmallScreen ? 'Item' : 'Product/Service'}</td>
                                            <td>{isSmallScreen ? 'Stock' : 'Stock QTY'}</td>
                                            <td>{isSmallScreen ? 'Price' : 'Unit Price'}</td>
                                            <td>{isSmallScreen ? 'Type' : 'Tax Type'}</td>
                                            <td>UOM</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers && customers.map((e) => (<>
                                            <tr style={{ backgroundColor: e.Status !== "Active" ? 'lightgoldenrodyellow' : '' }}>
                                                <td>{e.FullName || ''}</td>
                                                <td>{e.Rating || ''}</td>
                                                <td>{e.Address || ''}</td>
                                                <td>{e.TaxType === "" ? 'STANDARD' : e.TaxType || ''}</td>
                                                <td>{e.Email || ''}</td>
                                                <td>
                                                    {/* <Edit
                                                        fontSize='small' 
                                                        onClick={() => handleEdit(e.key)} 
                                                        color='primary' 
                                                        sx={{ cursor: 'pointer' }} 
                                                    />
                                                    <Delete 
                                                        fontSize='small' 
                                                        onClick={() => handleDelete(e.key)} 
                                                        color='error' 
                                                        sx={{ cursor: 'pointer' }} 
                                                    /> */}
                                                </td>
                                            </tr>
                                        </>))}
                                    </tbody>
                                </table>
                                <Button
                                    variant='outlined'
                                    color='primary'
                                    onClick={()=>window.alert('coming soon!')}
                                    sx={{ marginTop: 2, alignItems: 'center', textAlign: 'center' }}
                                >
                                    Submit
                                </Button>								
                            </div>
                        ) : (
                            <div {...getRootProps()} style={{ border: '2px dashed #eee', margin: isSmallScreen ? 0 : '20px', textAlign: 'center' }}>
                                <input {...getInputProps()} />
                                <img src={Upload} alt='click to upload product' width="70%" height="70%" />
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
                                    <Grid item xs={6}>
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
                                    <Grid item xs={6}>
                                        <FormControlLabel
                                            label={formData.userExemption === "Taxable" ? "Taxable" : "Exempted"}
                                            control={
                                                <Checkbox
                                                    onChange={changeUserStat}
                                                    color="error"
                                                    name='userExemption'
                                                />
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl fullWidth>
                                            Rating
                                            <Slider
                                                min={0} 
                                                max={5} 
                                                defaultValue={3}
                                                onChange={handleInputChange}
                                                valueLabelDisplay='on'
                                                name='userRating'
                                                color='success'
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
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
                                    <Grid item xs={12}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label="TIN or Ghana Card Number"
                                                required
                                                name="userTIN"
                                                value={formData.userTIN}
                                                onChange={handleInputChange}
                                                error={!!errors.userTIN}
                                                helperText={errors.userTIN}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
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
                                    <Grid item xs={12}>
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
                                    <Grid item xs={12}>
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
                                    <Grid item xs={12}>
                                        <DialogActions>
                                            <Button onClick={closeAddnewUser} variant='outlined' color='error'>Cancel</Button>
                                            <Button onClick={handleFormSubmit} variant='outlined' color='primary'>{drop ? <CircularProgress open={drop} size='25px' /> : 'Submit'}</Button>
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
