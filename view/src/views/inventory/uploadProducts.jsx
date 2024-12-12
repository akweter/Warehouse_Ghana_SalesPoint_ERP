
// /* eslint-disable */
import React, { useCallback, useState, useEffect } from 'react';
import Upload from '../../assets/images/Upload.webp';
import { useDropzone } from 'react-dropzone';
import {
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
} from '@mui/material';
import { IconEraser } from '@tabler/icons';
import { CancelSharp, Delete, Edit } from '@mui/icons-material';
import { PostNewProducts, UpdateProduct } from '../../apiActions/allApiCalls/product';
import { fetchSupplierNameSearch } from '../../apiActions/allApiCalls/supplier';
import ProductTemplate from './productTemplate';
import { Stack } from '@mui/system';
import Papa from 'papaparse';
import { ShowBackDrop } from '../../utilities/backdrop';
import { AlertError } from '../../utilities/errorAlert';


const UploadCSVProducts = ({ productLine, openDialog, CloseDialog, action, refreshPage }) => {
	const [open, setOpen] = useState(false);
	const [drop, setDrop] = useState(false);
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [allSearch, setAllSearch] = useState([])
	const [alert, setAlert] = useState({ message: '', color: '' });
	const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);
	const [formData, setFormData] = useState({
		productCategory: '',
		productName: '',
		productStatus: 'Active',
		productImage: '',
		productStockQty: '',
		productUnitPrice: '',
		productSupId: '',
		productTaxType: '',
		productAddDate: '',
		productID: '',
		productUOM: '',
	});

	// update form state with incoming product
	useEffect(() => {
		if (productLine) {
			const {
				productCategory,
				productName,
				Itm_status,
				stockQTY,
				unitPrice,
				Itm_sup_id,
				taxType,
				itm_date,
				productUOM,
				Itm_img,
				productID,
			} = productLine;

			setFormData((state) => ({
				...state,
				productCategory: productCategory,
				productName: productName,
				productStatus: Itm_status,
				productImage: Itm_img,
				productStockQty: stockQTY,
				productUnitPrice: unitPrice,
				productSupId: Itm_sup_id,
				productTaxType: taxType,
				productAddDate: itm_date,
				productUOM: productUOM,
				productID: productID,
			}));
		}
	}, [productLine]);

	// querying product and customer search
	useEffect(() => {
		fetchData();
	}, []);

	// Set Data Grid according to screens sizes
    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 600);
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			const data = await fetchSupplierNameSearch(allSearch);
			setAllSearch(data);
		}
		catch (error) {
			return;
		}
		setLoading(false);
	}

	// Product active change
	const changeProductStat = () => {
		setFormData({
			...formData,
			productStatus: formData.productStatus === "Active" ? "Inactive" : "Active",
		});
	};
 
	// handle product excel drop
	const handleDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const csvData = e.target.result;
                const jsonData = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;
                setProducts(jsonData);
            };
            reader.readAsText(file);
        });
    }, []);


	// edit selected row or for data
	const handleEdit = (index) => {
		const editedProduct = products.find((product) => product.productName === index);
		setSelectedProduct(editedProduct);
		setFormData({
			productName: editedProduct.productName,
			productUnitPrice: editedProduct.productUnitPrice,
			productStockQty: editedProduct.productStockQty,
			productTaxType: editedProduct.productTaxType,
			productStatus: editedProduct.productStatus,
			productCategory: editedProduct.productCategory,
		});

		// Remove the selected item from the table
		const updatedProducts = products.filter((product) => product !== editedProduct);
		setProducts(updatedProducts);
	};

	// Hanlde form onchange
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		const formValue = value.toUpperCase();
		setFormData({ ...formData, [name]: formValue, });
	};

	// Handle add button when clicked
	const handleAdd = () => {
		if (
			!formData.productName ||
			!formData.productUnitPrice ||
			!formData.productStockQty ||
			!formData.productCategory
		) {
			setAlert((e) => ({ ...e, message: 'Please the fields are required!. Cannot be left empty', color: 'error' }));
			setOpen(true);
			return;
		}
		if (selectedProduct) {
			const updatedProducts = [...products, { ...selectedProduct, ...formData }];
			setProducts(updatedProducts);
			setSelectedProduct(null);
		}
		else {
			setProducts([...products, { ...formData }]);
		}
 
		// Clear form data
		setFormData({
			productName: '',
			productUnitPrice: '',
			productStockQty: '',
			productTaxType: '',
			productStatus: '',
			productCategory: '',
		});
	};

	const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });
	const handleClose = (event, reason) => { if (reason === 'clickaway') { return; } setOpen(false); };

	// When Delete button clicked
	const handleDelete = (index) => {
		// Remove the item from the table based on the key
		const updatedProducts = products.filter((product) => product.productName !== index);
		setProducts(updatedProducts);
	};

	// Set item date
	const setProductDate = (products) => {
		const Dating = new Date();
		const formattedDate = `${Dating.getFullYear()}-${String(Dating.getMonth() + 1).padStart(2, '0')}-${String(Dating.getDate()).padStart(2, '0')}`;

		const systemUser = window.localStorage.getItem('userInfo');
		if (systemUser) {
			const parseSystemUser = JSON.parse(systemUser);
			const systemUserName = parseSystemUser.accountId;

			if (Array.isArray(products) && products.length > 0) {
				if (systemUserName) {
					const updatedProducts = products.map((product) => ({
						...product,
						productAddDate: formattedDate, productUserId: systemUserName,
					}));
					return updatedProducts;
				}
			}
		}
	}

	// Clear products from the state and close dialog
	const clearData = () => {
		CloseDialog();
		setProducts([]);
	}

	// Clear products from the state and close dialog
	const clearProductsData = () => {
		setProducts([]);
	}

	// Post new product or update product
	const UpdateOrPost = async () => {
		const trimProducts = products.filter((product) => product.key !== 0);
		const productsToBackend = setProductDate(trimProducts);
		const { productID } = productsToBackend[0];

		if (action && action === 'edit') {
			const result = await UpdateProduct(productID, productsToBackend);
			setAlert((e) => ({ ...e, message: 'Update successfully', color: 'success' }));
			setOpen(true);
			return result;
		}
		const result = await PostNewProducts(productsToBackend);
		setAlert((e) => ({ ...e, message: 'Added successfully', color: 'success' }))
		setOpen(true);
		return result;
	}

	// Submit product to server
	const submitProducts = async () => {
		setDrop(true);
		try {
			const response = await UpdateOrPost();
			const result = response.status;
			if (result === 'success') {
				setAlert((e) => ({...e, message: `You've done it!`, color: 'success' }));
				setProducts([]);
				refreshPage();

				setTimeout(() => {
                    CloseDialog(false);
                    setOpen(false);
                },1000);
			} else {
				return;
			}
		}
		catch (error) {
			setDrop(false);
			setAlert((e) => ({ ...e, message: 'Operation failed! \nPlease refresh try again', color: 'error' }));
		}
		setDrop(false);
		setOpen(true);
	};

	return (
		<>
			<Dialog
				maxWidth="xl"
				fullWidth
				open={openDialog}
				// TransitionComponent={Slide}
				transitionDuration={700}
				// sx={{ background: 'white' }}
			>
				{
					alert.message ? (
						<AlertError open={open} alert={alert} handleClose={handleClose} />
					) : (
						<ShowBackDrop open={drop} />
					)
				}
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
							Add | Update Product
						</Typography>
						<Grid item>
							<FormControl fullWidth>
								<Stack direction="row" spacing={2}>
									<Button
										onClick={clearProductsData} 
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
						< ProductTemplate />
						<Grid item>
							<FormControl fullWidth>
								<Stack direction="row" spacing={2}>
									<IconButton
										onClick={clearData} 
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
				<Grid container marginTop={isSmallScreen ? 7 : 0} spacing={2} padding={3} minHeight={isSmallScreen ? 500 : 600}>
					<Grid item xs={12} lg={8} justifyContent='stretch' alignItems='center'>
						<Typography 
							variant={isSmallScreen ? 'subtitle1' : 'h3'} 
							color="darkred" 
							align='center' 
							paddingBottom={2}
						>
							Upload Excel Bulk Products
						</Typography>
							{products.length > 0 ? (
								<div style={{ justifyContent: 'stretch', alignItems: 'center' }} >
									<table width='100%' border={1}>
										<thead style={{ fontWeight: 'bolder' }}>
											<tr>
												<td>{isSmallScreen ? 'Item' : 'Product/Service'}</td>
												<td>{isSmallScreen ? 'Stock' : 'Stock QTY'}</td>
												<td>{isSmallScreen ? 'Price' : 'Unit Price'}</td>
												<td>{isSmallScreen ? 'Type' : 'Tax Type'}</td>
												<td>UOM</td>
												{/* <td></td> */}
											</tr>
										</thead>
										<tbody>
											{products.map((e) => (<>
												<tr style={{ backgroundColor: e.productStatus !== "Active" ? 'lightgoldenrodyellow' : '' }}>
													<td>{e.productName || ''}</td>
													<td>{e.productStockQty || ''}</td>
													<td>{e.productUnitPrice || ''}</td>
													<td>{e.productTaxType === "" ? 'STANDARD' : e.productTaxType || ''}</td>
													<td>{e.productUOM || ''}</td>
													<td>
														<Edit
															fontSize='small' 
															onClick={() => handleEdit(e.productName)} 
															color='primary' 
															sx={{ cursor: 'pointer' }} 
														/>
														<Delete 
															fontSize='small' 
															onClick={() => handleDelete(e.productName)} 
															color='error' 
															sx={{ cursor: 'pointer' }} 
														/>
													</td>
												</tr>
											</>))}
										</tbody>
									</table>
									<Button
										variant='outlined'
										color='primary'
										onClick={submitProducts}
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
					<Grid item xs={12} lg={4} justifyContent='stretch' alignItems='center' paddingBottom={2}>
						<Typography 
							variant={isSmallScreen ? 'subtitle1' : 'h3'} 
							color="darkred"
							align='center' 
							paddingBottom={2}
						>
							Add Single Product
						</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<TextField
										label="Product Name"
										required
										name="productName"
										value={formData.productName || ''}
										onChange={handleInputChange}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<TextField
										label="Unit Price"
										required
										name="productUnitPrice"
										type='number'
										value={formData.productUnitPrice || ''}
										onChange={handleInputChange}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<TextField
										label="Stock Quantity"
										required
										name="productStockQty"
										type="number"
										value={formData.productStockQty || ''}
										onChange={handleInputChange}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<InputLabel>{formData.productTaxType === "" ? "Standard" : "Tax Type"}</InputLabel>
									<Select
										disabled={true}
										name="productTaxType"
										// required
										value={formData.productTaxType || ''}
										onChange={handleInputChange}
									>
										<MenuItem value="">STANDARD</MenuItem>
										<MenuItem value="CST">CST</MenuItem>
										<MenuItem value="TRSM">TOURISM</MenuItem>
										<MenuItem value="EXM">EXEMPTED</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<TextField
										label="Item Category"
										required
										name="productCategory"
										value={formData.productCategory || ''}
										onChange={handleInputChange}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<Autocomplete
										id="supplier-search"
										options={allSearch}
										loading={loading}
										getOptionLabel={(option) => option.supplierName ? option.supplierName : "No Supplier found"}
										onChange={(event, selectedSupplier) => {
											if (selectedSupplier) {
												setFormData((oldValue) => ({
													...oldValue,
													productSupId: selectedSupplier.supplierID,
												}));
											}
										}}
										renderInput={(params) => (
											<TextField
												{...params}
												label="Supplier Name"
												variant="outlined"
												color="primary"
												size="medium"
												fullWidth
												InputProps={{
													...params.InputProps,
													endAdornment: (
														<>
															{loading ? <CircularProgress color="primary" size={20} /> : null}
															{params.InputProps.endAdornment}
														</>
													),
												}}
											/>
										)}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<InputLabel>UOM</InputLabel>
									<Select
										name="productUOM"
										required
										value={formData.productUOM || ''}
										onChange={handleInputChange}
									>
										<MenuItem value="BAG">BAG</MenuItem>
										<MenuItem value="BND">BUNDLE</MenuItem>
										<MenuItem value="CTN">CARTON</MenuItem>
										<MenuItem value="KG">KILOGRAM</MenuItem>
										<MenuItem value="LTR">LITER</MenuItem>
										<MenuItem value="M">MITER</MenuItem>
										<MenuItem value="ML">MILLIMETER (ML)</MenuItem>
										<MenuItem value="PC">PIECE</MenuItem>
										<MenuItem value="PKT">PACKET</MenuItem>
										<MenuItem value="PND">POUND</MenuItem>
										<MenuItem value="ROLL">ROLL</MenuItem>
										<MenuItem value="SG">SINGLE</MenuItem>
										<MenuItem value="TIER">TIER</MenuItem>
										<MenuItem value="YD">YARD</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControlLabel
									label={formData.productStatus === "Active" ? "Active" : "Inactive"}
									control={
										<Checkbox
											checked={formData.productStatus === "Active"}
											onChange={changeProductStat}
											color="secondary"
										/>
									}
								/>
							</Grid>
							<Grid item xs={12}>
								<Button
									variant='contained'
									color='info'
									fullWidth
									onClick={handleAdd}
								>
									Add Product
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Dialog>
		</>
	);
};

export default UploadCSVProducts;
