import React, { useCallback, useState, useEffect } from 'react';
import Upload from '../../assets/images/Upload.webp';
import { useDropzone } from 'react-dropzone';
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Grid,
	TextField,
	InputLabel,
	MenuItem,
	Select,
	Typography,
	Box,
	FormControl,
	Autocomplete,
	CircularProgress,
	FormControlLabel,
	Checkbox,
	AppBar,
	Toolbar,
	Dialog,
	Slide,
} from '@mui/material';
import { PostNewProducts } from 'apiActions/allApiCalls/product';
import { CancelSharp, Delete, Edit } from '@mui/icons-material';
import { fetchSupplierNameSearch } from 'apiActions/allApiCalls/supplier';
import ProductTemplate from './productTemplate';
import { Stack } from '@mui/system';
import { ShowBackDrop } from 'utilities/backdrop';
import { AlertError } from 'utilities/errorAlert';


const UploadCSVProducts = ({ productLine, openDialog, CloseDialog, setSubmiited }) => {
	const [open, setOpen] = useState(false);
	const [drop, setDrop] = useState(false);
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState([]);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [allSearch, setAllSearch] = useState([])
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
		productUOM: ''
	});
	const [alert, setAlert] = useState({ message: '', color: '' });

	// update form state with incoming product
	useEffect(() => {
		if (productLine) {
			const {
				Itm_cat,
				Itm_name,
				Itm_status,
				Itm_qty,
				Itm_price,
				Itm_sup_id,
				Itm_usr_id,
				Itm_taxable,
				itm_date,
				Itm_UOM,
				Itm_img,
			} = productLine;

			setFormData((state) => ({
				...state,
				productCategory: Itm_cat,
				productName: Itm_name,
				productStatus: Itm_status,
				productImage: Itm_img,
				productStockQty: Itm_qty,
				productUnitPrice: Itm_price,
				productSupId: Itm_sup_id,
				productTaxType: Itm_taxable,
				productAddDate: itm_date,
				productUOM: Itm_UOM
			}));
		}
	}, [productLine]);

	// querying product and customer search
	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				const data = await fetchSupplierNameSearch(allSearch);
				setAllSearch(data);
			}
			catch (error) {
				setLoading(false);
			}
		}
		fetchData();
	}, [allSearch]);

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

			reader.onload = async (e) => {
				const csvData = new TextDecoder('utf-8').decode(e.target.result);
				const jsonData = csvData
					.split('\n')
					.map((row) => row.split(','))
					.filter((row) => row.some((cell) => cell.trim() !== ''))
					.map((row, index) => {
						const [
							productCategory,
							productName,
							productStatus,
							productStockQty,
							productUnitPrice,
							productSupId,
							productTaxType,
							productUOM,
						] = row.map((value) => value.trim());
						return {
							key: index,
							productCategory,
							productName,
							productStatus,
							productStockQty,
							productUnitPrice,
							productSupId,
							productTaxType,
							productUOM,
						};
					});
				setProducts(jsonData);
			};

			reader.readAsArrayBuffer(file);
		});
	}, []);

	// edit selected row or for data
	const handleEdit = (index) => {
		const editedProduct = products.find((product) => product.key === index);
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
		setFormData({
			...formData,
			[name]: value,
		});
	};

	// Handle add button when clicked
	const handleAdd = () => {
		if (selectedProduct) {
			const updatedProducts = [...products, { ...selectedProduct, ...formData }];
			setProducts(updatedProducts);
			setSelectedProduct(null);
		}
		else {
			setProducts([...products, { key: Date.now(), ...formData }]);
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

	// When Delete button clicked
	const handleDelete = (index) => {
		// Remove the item from the table based on the key
		const updatedProducts = products.filter((product) => product.key !== index);
		setProducts(updatedProducts);
	};

	// Set item date
	const setProductDate = (products) => {
		const Dating = new Date();
		const formattedDate = `${Dating.getFullYear()}-${String(Dating.getMonth() + 1).padStart(2, '0')}-${String(Dating.getDate()).padStart(2, '0')}`;

		const systemUser = window.sessionStorage.getItem('userInfo');
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

	// Submit product to server
	const submitProducts = async () => {
		const trimProducts = products.filter((product) => product.key !== 0);
		const productsToBackend = setProductDate(trimProducts);

		try {
			await new Promise((resolve) => {
				setAlert((e) => ({ ...e, message: '', color: '' }));
				setDrop(true);
				setTimeout(resolve, 2000);
			});

			const response = await PostNewProducts(productsToBackend);
			const result = response.status;
			if (result === 'success') {
				setSubmiited(true);
				setDrop(false);
				setAlert((e) => ({ ...e, message: result, color: 'success' }));
				setOpen(true);
				CloseDialog(false);
				setTimeout(() => {
					setSubmiited(false);
					setProducts([]);
				}, 2000);
			}
		}
		catch (error) {
			setDrop(false);
			setAlert((e) => ({ ...e, message: 'Submission failed! \nPlease try again', color: 'error' }));
			setOpen(false);
		}
	};

	const { getRootProps, getInputProps } = useDropzone({ onDrop: handleDrop });

	// handle alerts
	const handleClose = (event, reason) => { if (reason === 'clickaway') { return; } setOpen(false); };

	return (
		<Dialog
			maxWidth="xl"
			open={openDialog}
			TransitionComponent={Slide}
			transitionDuration={700}
			sx={{ background: 'white' }}
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
						variant="h2"
						sx={{
							flex: 1,
							textAlign: 'center',
							color: 'white'
						}}
					>
						Inventory | Stock Management
					</Typography>
					< ProductTemplate />
					<Grid item>
						<FormControl fullWidth>
							<Stack direction="row" spacing={2}>
								<Button onClick={CloseDialog} fullWidth color='error' variant="contained" size='small' startIcon={<CancelSharp />}>
									Cancel
								</Button>
							</Stack>
						</FormControl>
					</Grid>
				</Toolbar>
			</AppBar>
			<Grid container spacing={2} padding={3}>
				<Box
					sx={{
						borderRadius: 4,
						bgcolor: 'background.default',
						display: 'grid',
						flexDirection: 'row',
						gridTemplateColumns: { md: '1fr 2fr' },
						gap: 2
					}}
				>
					<Box>
						<Typography variant='h3' color="darkred" align='center' paddingBottom={2}>
							Add Single Product
						</Typography>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<TextField
										label="Product Name"
										required
										name="productName"
										value={formData.productName}
										onChange={handleInputChange}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<FormControl fullWidth>
									<TextField
										label="Unit Price"
										required
										name="productUnitPrice"
										type='number'
										value={formData.productUnitPrice}
										onChange={handleInputChange}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<FormControl fullWidth>
									<TextField
										label="Stock Quantity"
										required
										name="productStockQty"
										type="number"
										value={formData.productStockQty}
										onChange={handleInputChange}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<FormControl fullWidth>
									<InputLabel>{formData.productTaxType === "" ? "Standard" : "Tax Type"}</InputLabel>
									<Select
										name="productTaxType"
										// required
										value={formData.productTaxType}
										onChange={handleInputChange}
									>
										<MenuItem value="">Standard</MenuItem>
										<MenuItem value="CST">CST</MenuItem>
										<MenuItem value="TRSM">Tourism</MenuItem>
										<MenuItem value="EXM">Exempted</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<FormControl fullWidth>
									<TextField
										label="Item Category"
										required
										name="productCategory"
										value={formData.productCategory}
										onChange={handleInputChange}
									/>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<FormControl fullWidth>
									<Autocomplete
										id="supplier-search"
										options={allSearch}
										loading={loading}
										getOptionLabel={(option) => option.SnC_name ? option.SnC_name : "No Supplier"}
										onChange={(event, selectedSupplier) => {
											if (selectedSupplier) {
												const supplierName = selectedSupplier.SnC_name;
												setFormData((oldValue) => ({
													...oldValue,
													productSupId: selectedSupplier.SnC_id,
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
							<Grid item xs={6}>
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
							<Grid item xs={6}>
								<FormControl fullWidth>
									<InputLabel>UOM</InputLabel>
									<Select
										name="productUOM"
										required
										value={formData.productUOM}
										onChange={handleInputChange}
									>
										<MenuItem value="BKT">Bucket</MenuItem>
										<MenuItem value="BOX">Box</MenuItem>
										<MenuItem value="CM³">Cubic Centimeter</MenuItem>
										<MenuItem value="FT">Foot</MenuItem>
										<MenuItem value="GAL">Gallon</MenuItem>
										<MenuItem value="KM">Kilometer</MenuItem>
										<MenuItem value="KW">Kilowatt</MenuItem>
										<MenuItem value="LTR">Liter</MenuItem>
										<MenuItem value="M">Meter</MenuItem>
										<MenuItem value="ML">Milliliter (ml)</MenuItem>
										<MenuItem value="MM">Milimeter (mm)</MenuItem>
										<MenuItem value="LBS">Pound</MenuItem>
										<MenuItem value="PC">Piece</MenuItem>
										<MenuItem value="SH">Sheet</MenuItem>
										<MenuItem value="SINGLE">Single</MenuItem>
										<MenuItem value="SQFT">Square Foot</MenuItem>
										<MenuItem value="SQM">Square Meter</MenuItem>
										<MenuItem value="TIER">Tier</MenuItem>
										<MenuItem value="YARD">Yard</MenuItem>

									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={6}>
								<Button
									variant='contained'
									color='info'
									size='large'
									fullWidth
									onClick={handleAdd}
								>
									Add Product
								</Button>
							</Grid>
						</Grid>
					</Box>
					<Box>
						<Typography variant='h3' color="darkred" align='center' paddingBottom={2}>
							Upload Excel Bulk Products
						</Typography>
						{products.length > 0 ? (
							<>
								<TableContainer component={Paper} style={{ marginTop: '20px' }}>
									<Table style={{ minWidth: '100%' }}>
										<TableHead>
											<TableRow>
												<TableCell padding='none'>Product/Service</TableCell>
												<TableCell padding='none'>Stock QTY</TableCell>
												<TableCell padding='none'>Unit Price</TableCell>
												<TableCell padding='none'>Tax Type</TableCell>
												<TableCell padding='none'>UOM</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{products.map((e, index) => (
												<>
													<TableRow>
														<TableCell padding='none'>{e.productName}</TableCell>
														<TableCell padding='none'>{e.productStockQty}</TableCell>
														<TableCell padding='none'>{e.productUnitPrice}</TableCell>
														<TableCell padding='none'>{e.productTaxType === "" ? 'STANDARD' : e.productTaxType}</TableCell>
														<TableCell padding='none'>{e.productUOM}</TableCell>
														<TableCell padding='none'>
															<Edit fontSize='small' onClick={() => handleEdit(e.key)} color='primary' sx={{ cursor: 'pointer' }} />
															<Delete fontSize='small' onClick={() => handleDelete(e.key)} color='error' sx={{ cursor: 'pointer' }} />
														</TableCell>
													</TableRow>
												</>
											))}
										</TableBody>
									</Table>
								</TableContainer>
								<Button
									variant='outlined'
									color='primary'
									size='large'
									onClick={submitProducts}
									style={{ marginTop: '20px' }}
								>
									Submit
								</Button>
							</>
						) : (
							<div {...getRootProps()} style={{ border: '2px dashed #eee', padding: '20px', textAlign: 'center' }}>
								<input {...getInputProps()} />
								<img src={Upload} alt='' width="30%" height="20%" />
							</div>
						)}
					</Box>
				</Box >
			</Grid>
		</Dialog>
	);
};

export default UploadCSVProducts;
