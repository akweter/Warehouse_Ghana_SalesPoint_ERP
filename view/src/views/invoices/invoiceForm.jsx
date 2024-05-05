import React, { useState, useEffect } from 'react';
import '../../assets/css/form.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import SendSharpIcon from '@mui/icons-material/SendSharp';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    FormControl,
    Grid,
    Paper,
    Box,
    Stack,
    TextField,
    Button,
    Autocomplete,
    CircularProgress,
    Select,
    InputLabel,
    MenuItem,
    ToggleButtonGroup,
    ToggleButton,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Screens from 'ui-component/cardDivision';
import dayjs from 'dayjs';

// Projects
import { headerPayload, itemlistPayload } from 'views/payload/payloadStructure';
import { AlertError } from 'utilities/errorAlert';
import { ShowBackDrop } from 'utilities/backdrop';
import { postNewInvoice } from 'apiActions/allApiCalls/invoice';
import { fetchProductNameSearch } from 'apiActions/allApiCalls/product';
import { fetchCustomerNameSearch } from 'apiActions/allApiCalls/customer';
import { computeStandardTaxes } from 'utilities/computeAllTaxes';

// /* eslint-disable */

const InvoiceForm = ({ setSubmitted, setDrop, drop, BackdropOpen }) => {
    const [open, setOpen] = useState(false);
    const [compute, setCompute] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disableCustomer, setDisableCustomer] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [allSearch, SetAllSearch] = useState({ product: ([]), customer: ([]) });
    const [header, setHeader] = useState(headerPayload);
    const [itemlists, setItemLists] = useState(itemlistPayload);
    const [alert, setAlert] = useState({ message: '', color: 'success' });

    // Call and set new invoice number
    useEffect(() => {
        const systemUser = window.sessionStorage.getItem('userInfo');
        if (systemUser) {
            const parseSystemUser = JSON.parse(systemUser);
            const systemUserName = parseSystemUser.userName;
            if (systemUserName) {
                setHeader((state) => ({ ...state, userName: systemUserName, status: "INVOICE" }));
            } else {
                setHeader((state) => ({ ...state, userName: 'Unknown', status: "INVOICE" }));
            }
        }

        // Generate random number for invoices (development sake)
        function generateRandomNumber() {
            const length = 10;
            const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
            return randomNumber.toString().padStart(length, '0');
        }
        setHeader((prevHeader) => ({
            ...prevHeader,
            increment: "",
            invoiceNumber: generateRandomNumber(),
            reference: ""
        }));

        // // Get invoice information
        //     const setInvoiceNumber = async () => {
        //         const minutes = (new Date().getMinutes() + 1).toString().padStart(2, '0');
        //         const hours = (new Date().getHours() + 1).toString().padStart(2, '0');
        //         const today = new Date().getDate().toString().padStart(2, '0');
        //         const currentYear = new Date().getFullYear().toString().slice(-2);
        //         const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

        //         try {
        //             // Fetch auto complete data
        //             const data = await fetchAutocompleteId();
        //             const lastInvoice = data[data.length - 1];
        //             const lastInvoiceDate = new Date(lastInvoice.Inv_date);
        //             const lastInvoiceYear = lastInvoiceDate.getFullYear().toString().slice(-2);
        //             const lastInvoiceMonth = (lastInvoiceDate.getMonth() + 1).toString().padStart(2, '0');

        //             let invoiceNum = 1;
        //             if (currentMonth === lastInvoiceMonth) {
        //                 invoiceNum = lastInvoice.autoIncrementID + 1;
        //             }
        //             setHeader((prevHeader) => ({
        //                 ...prevHeader,
        //                 increment: invoiceNum,
        //                 invoiceNumber: `${currentYear}${currentMonth}${invoiceNum}CSD`,
        //                 reference: `${currentYear}${currentMonth}${today}${invoiceNum}CSD`
        //             }));
        //         }
        //         catch (error) {
        //             setHeader((prevHeader) => ({
        //                 ...prevHeader,
        //                 invoiceNumber: `${currentYear}${currentMonth}${today}${hours}${minutes}TM`,
        //                 reference: `${currentYear}${currentMonth}${today}${hours}${minutes}TM`
        //             }));
        //         }
        //     }
        //     setInvoiceNumber();
    }, [header.invoiceNumber, header.businessPartnerName]);

    // querying product and customer search
    useEffect(() => {
        setLoading(true);

        const fetchData = async () => {
            try {
                const data = await fetchProductNameSearch(allSearch.product);
                SetAllSearch((prevState) => ({
                    ...prevState, product: data,
                }));
                const result = await fetchCustomerNameSearch(allSearch.customer);
                SetAllSearch((prevState) => ({
                    ...prevState, customer: result,
                }));
            }
            catch (error) {
                setLoading(false);
            }
        }
        fetchData();
    }, [allSearch]);

    // disable customer cash && Update currency for Ghana cedis.
    useEffect(() => {
        const { currency, businessPartnerName, businessPartnerTin } = header;

        if (currency === 'GHS') {
            setHeader(state => ({ ...state, exchangeRate: '1.0' }));
        } else if (businessPartnerName !== null && businessPartnerTin === "C0000000000") {
            setDisableCustomer(true);
        } else {
            setDisableCustomer(false);
        }
    }, [header.businessPartnerName, header.currency, header.exchangeRate]);

    // Compute final/total taxes and levies
    useEffect(() => {
        if (compute === true) {
            const result = computeStandardTaxes(header);
            const {
                totalLevy,
                totalAmount,
                voucherAmount,
                discountAmount,
                nhil,
                getfund,
                covid,
                cst,
                tourism,
                items,
                totalVat,
            } = result;
            setHeader((state) => ({...state,
                totalAmount: totalAmount,
                voucherAmount: voucherAmount,
                discountAmount: discountAmount,
                totalLevy: totalLevy,
                nhil: nhil,
                getfund: getfund,
                tourism: tourism,
                covid: covid,
                items: items,
                cst: cst,
                totalVat: totalVat,
            }));
        }
        setTimeout(() => {
            setCompute(false);
        }, 1000);
    }, [compute]);

    // edit item function
    const handleEdit = (index) => {
        setEditIndex(index);
        setOpenEditDialog(true);
        const itemToEdit = header.items[index];
        setItemLists({ ...itemToEdit });
    };

    // save edited item function
    const handleEditSave = () => {
        const updatedItems = [...header.items];
        updatedItems[editIndex] = { ...itemlists };

        const { description, unitPrice, quantity, discountAmount } = itemlists;

        if (description === "" || description === null) {
            setAlert((e) => ({ ...e, message: 'Product name cannot be empty', color: 'error' }));
            return setOpen(true);
        }
        else if (unitPrice === undefined || unitPrice === null || unitPrice <= 0) {
            setAlert((e) => ({ ...e, message: 'Unit price should be positve value', color: 'error' }));
            return setOpen(true);
        }
        else if (quantity === "" || quantity === null || quantity <= 0) {
            setAlert((e) => ({ ...e, message: 'Only positive quantity value is allowed', color: 'error' }));
            return setOpen(true);
        }
        else if (discountAmount >= (quantity * unitPrice)) {
            setAlert((e) => ({ ...e, message: `Disount should be less than the subtotal ${quantity * unitPrice}`, color: 'error' }));
            return setOpen(true);
        }
        else {
            setHeader((head) => ({ ...head, items: updatedItems }));
            setCompute(true);
            setItemLists((prevState) => ({
                ...prevState,
                quantity: '',
                discountAmount: '',
                unitPrice: ''
            }));
            setOpenEditDialog(false);
            setEditIndex(null);
        }
    };

    // cancel edit item function
    const handleEditCancel = () => {
        setItemLists((prevState) => ({
            ...prevState,
            quantity: '',
            discountAmount: '',
            unitPrice: ''
        }));
        setOpenEditDialog(false);
        setEditIndex(null);
    };

    // delete item function
    const handleDelete = (index) => {
        const updatedItems = [...header.items];
        updatedItems.splice(index, 1);
        setHeader({
            ...header,
            items: updatedItems,
        });
    };

    // handle cash onchange
    const handleCashChange = (event, custype) => {
        setHeader({
            ...header,
            businessPartnerName: custype,
            businessPartnerTin: 'C0000000000',
            invCusId: "cashid"
        });
        setDisableCustomer(true);
        setCompute(false);
    };

    // handle header onchange
    const handleMainChange = (event) => {
        const { name, value } = event.target;
        setHeader({ ...header, [name]: value });
        setItemLists({ ...itemlists, [name]: value });
        setCompute(false);
    };

    // Discount Type onChnage
    const handleDiscountChange = (event) => {
        const isChecked = event.target.checked;
        const updatedDiscountType = isChecked ? 'SELECTIVE' : 'GENERAL';

        setHeader((prevHeader) => ({
            ...prevHeader,
            discountType: updatedDiscountType,
        }));
        setCompute(false);
    };

    // Show alert function.
    const showAlert = (message, color) => {
        setAlert({ message, color });
        setOpen(true);
    };

    const isPositiveNumber = (value) => !isNaN(value) && value > 0;

    // Add items to the basket
    const addItemsToBasket = () => {
        const { description, unitPrice, quantity, discountAmount } = itemlists;

        if (!isPositiveNumber(quantity)) {
            showAlert('Quantity must be a positive number', 'error');
            return;
        }
        else if (description === "" || description === null) {
            showAlert('Product name cannot be empty', 'error');
            return;
        }
        else if (!isPositiveNumber(unitPrice)) {
            showAlert('Unit price must be positive value', 'error');
            return;
        }
        else if (discountAmount >= (quantity * unitPrice)) {
            showAlert(`Disount should be less than the subtotal amount: ${quantity * unitPrice}`, 'error');
            return;
        }
        else {
            setHeader((prevHeader) => ({
                ...prevHeader,
                items: [...prevHeader.items, { ...itemlists }],
            }));
            setCompute(true);
            setItemLists({
                ...itemlists,
                itemCode: "",
                itemCategory: null,
                expireDate: "",
                description: "",
                quantity: "",
                levyAmountA: "",
                levyAmountB: "",
                levyAmountC: "",
                levyAmountD: "",
                levyAmountE: "",
                discountAmount: 0.00,
                batchCode: "",
                unitPrice: "",
                itemSubtotal: "",
                totalVat: "",
                totalLevy: "",
                totalAmount: "",
            });
        }
    }

    // Submit form to GRA
    const submitFormToGRA = async () => {
        const mandatoryFields = [
            'currency',
            'calculationType',
            'transactionDate',
            'exchangeRate',
            'saleType',
            'businessPartnerName',
            'businessPartnerTin',
            'invoiceNumber',
            'userName',
            'flag',
            'totalAmount',
            'items'
        ];

        const emptyFields = mandatoryFields.filter(field => !header[field] || header[field] === '');

        if (emptyFields.length > 0) {
            const errorMessage = `Please ${emptyFields.join(', ')} cannot be empty.`;
            setAlert((e) => ({ ...e, message: errorMessage, color: 'error' }));
            return setOpen(true);
        }

        try {
            await new Promise((resolve) => {
                setAlert((e) => ({ ...e, message: '', color: '' }));
                setDrop(true);
                setTimeout(resolve, 2000);
            });

            const data = await postNewInvoice(header);
            if (data.status === "Error") {
                const res = JSON.stringify(data.message);
                setAlert((e) => ({ ...e, message: res, color: 'warning' }));
                setOpen(true);
            }
            else {
                setSubmitted(true)
                setDrop(false);
                setAlert((e) => ({ ...e, message: data.status, color: 'success' }));
                setOpen(true);
                BackdropOpen(false);
                setSubmitted(true);
            }
        }
        catch (error) {
            setDrop(false);
            setAlert((e) => ({ ...e, message: "Invoice submission failed! Refresh and try again", color: 'error' }));
            setOpen(true);
        }
    };

    // handle alerts
    const handleClose = (event, reason) => { if (reason === 'clickaway') { return; } setOpen(false); };

    return (<>
        <ThemeProvider theme={Screens.lightTheme}>
            {alert.message ?
                (<AlertError open={open} alert={alert} handleClose={handleClose} />) :
                (<ShowBackDrop open={drop} />)
            }
            <Box
                sx={{
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    display: 'grid',
                    flexDirection: 'row',
                    gridTemplateColumns: { md: '1.2fr 1.8fr' },
                }}
            >
                <Screens.Item>
                    <Grid container spacing={2} py={3}>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <ToggleButtonGroup
                                    fullWidth
                                    size='small'
                                    color="primary"
                                    value={header.businessPartnerName}
                                    exclusive
                                    name="businessPartnerName"
                                    onChange={handleCashChange}
                                >
                                    <ToggleButton value="Walk-In Customer">Cash Customer</ToggleButton>
                                </ToggleButtonGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <Autocomplete
                                    id="customer-search"
                                    options={allSearch.customer}
                                    loading={loading}
                                    getOptionLabel={(option) => header.businessPartnerName !== 'Cash' ? option.userName : ''}
                                    onChange={(event, selecteduser) => {
                                        if (selecteduser) {
                                            const customerName = selecteduser.userName;
                                            setHeader((oldValue) => ({
                                                ...oldValue,
                                                businessPartnerName: customerName,
                                                businessPartnerTin: selecteduser.userTIN,
                                                invCusId: selecteduser.SnC_id,
                                            }));
                                        }
                                    }}
                                    disabled={disableCustomer}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Customer Name"
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            fullWidth
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loading ? (<CircularProgress color="primary" size={20} />) : null}
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
                            <FormControl fullWidth>
                                <InputLabel id="saleType">Sales Type</InputLabel>
                                <Select
                                    required
                                    labelId="saleType"
                                    id="saleType"
                                    label="saleType"
                                    name="saleType"
                                    value={header.saleType}
                                    onChange={handleMainChange}
                                    size='small'
                                >
                                    <MenuItem value='NORMAL'>Normal</MenuItem>
                                    <MenuItem value='EXPORT'>Export</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="calculationType">Invoice Type</InputLabel>
                                <Select
                                    required
                                    labelId="calculationType"
                                    id="calculationType"
                                    label="calculationType"
                                    name="calculationType"
                                    value={header.calculationType}
                                    onChange={handleMainChange}
                                    size='small'
                                >
                                    <MenuItem value='INCLUSIVE'>Inclusive</MenuItem>
                                    <MenuItem value='EXCLUSIVE'>Exclusive</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="currency">Currency</InputLabel>
                                <Select
                                    required
                                    labelId="currency"
                                    id="currency"
                                    label="currency"
                                    name="currency"
                                    size='small'
                                    onChange={handleMainChange}
                                    value={header.currency}
                                >
                                    <MenuItem value='GHS'>Cedis (₵)</MenuItem>
                                    <MenuItem value='USD'>Dollars ($)</MenuItem>
                                    <MenuItem value='GBP'>Pounds (£)</MenuItem>
                                    <MenuItem value='EUR'>Euro (€)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="invoiceType">Transaction Type</InputLabel>
                                <Select
                                    labelId="invoiceType"
                                    id="invoiceType"
                                    label="invoiceType"
                                    name="invoiceType"
                                    size='small'
                                    onChange={handleMainChange}
                                    value={header.invoiceType}
                                >
                                    <MenuItem value='Invoice'>Invoice</MenuItem>
                                    <MenuItem value='Quotation'>Quotation</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Exchange Rate"
                                    type="number"
                                    value={header.exchangeRate}
                                    name='exchangeRate'
                                    size='small'
                                    onChange={handleMainChange}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        name="transactionDate"
                                        value={header.transactionDate || null}
                                        format='YYYY-MM-DD'
                                        label="Invoice Date"
                                        sx={{height: '10px'}}
                                        maxDate={dayjs()}
                                        onChange={(e) => {
                                            const selectedDate = e.$d;
                                            const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
                                            setHeader({ ...header, transactionDate: formattedDate });
                                        }}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Delivery/Shipping"
                                    type="text"
                                    value={header.delivery}
                                    name='delivery'
                                    size='small'
                                    onChange={handleMainChange}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControlLabel
                                label="Selective Discount"
                                control={
                                    <Checkbox
                                        checked={header.discountType === 'SELECTIVE'}
                                        onChange={handleDiscountChange}
                                        color="secondary"
                                        inputProps={{ 'aria-label': 'Checkbox for discount type' }}
                                    />
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Autocomplete
                                    id="product-search"
                                    options={allSearch.product}
                                    loading={loading}
                                    getOptionLabel={(option) => option.productName ? option.productName : ''}
                                    disabled={header.calculationType ? false : true}
                                    onChange={(event, selectedProduct) => {
                                        if (selectedProduct) {
                                            const newPrice = selectedProduct.unitPrice;
                                            setItemLists((oldValue) => ({
                                                ...oldValue,
                                                unitPrice: newPrice,
                                                description: selectedProduct.productName,
                                                itemCode: selectedProduct.productID,
                                                itemCategory: selectedProduct.taxType,
                                                alt: selectedProduct.productIncrement,
                                            }));
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Search product or service"
                                            variant="outlined"
                                            size="small"
                                            color="primary"
                                            fullWidth
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loading ? (<CircularProgress color="primary" size={20} />) : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Price / Rate"
                                    type="number"
                                    value={itemlists.unitPrice}
                                    name='unitPrice'
                                    size='small'
                                    onChange={handleMainChange}
                                    disabled={itemlists.description ? false : true}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Quantity / Period"
                                    type="number"
                                    value={itemlists.quantity}
                                    name='quantity'
                                    size='small'
                                    onChange={handleMainChange}
                                    disabled={itemlists.description ? false : true}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Discount"
                                    type="number"
                                    value={itemlists.discountAmount}
                                    name='discountAmount'
                                    size='small'
                                    onChange={handleMainChange}
                                    disabled={itemlists.description ? false : true}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>Remarks</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <textarea
                                        rows={4}
                                        cols={65}
                                        value={header.remarks}
                                        onChange={handleMainChange}
                                        name='remarks'
                                    />
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <Stack direction="row" spacing={2}>
                                    <Button onClick={addItemsToBasket} fullWidth color='primary' variant="contained" size='large' startIcon={<AddShoppingCartOutlinedIcon />}>
                                        Add Item
                                    </Button>
                                </Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <Stack direction="row" spacing={2}>
                                    <Button onClick={submitFormToGRA} fullWidth color='success' variant="contained" size='large' startIcon={<SendSharpIcon />}>
                                        Submit
                                    </Button>
                                </Stack>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Screens.Item>
                <Screens.Item>
                    <div style={{ width: '100%' }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                padding: '0 30px',
                                justifyContent: 'space-around',
                                fontSize: '18px',
                            }}
                        >
                            <p><strong>Customer: </strong>{header.businessPartnerName}</p>
                            <p><strong>Tin:</strong> {header.businessPartnerTin}</p>
                        </div>
                        <Grid container spacing={2}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Discount</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {header.items.map((item, index) => (
                                            <TableRow hover={true} key={index}>
                                                <TableCell padding='normal' size='small'>{item.description}</TableCell>
                                                <TableCell padding='none' size='small'>{item.quantity}</TableCell>
                                                <TableCell padding='none' size='small'>{item.unitPrice}</TableCell>
                                                <TableCell padding='none' size='small'>{item.discountAmount}</TableCell>
                                                <TableCell padding='none' size='small'>
                                                    <Tooltip title="Edit">
                                                        <IconButton onClick={() => handleEdit(index)}><EditIcon color='primary' /></IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton onClick={() => handleDelete(index)}><DeleteIcon color='error' /></IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Edit Dialog */}
                            <Dialog open={openEditDialog} onClose={handleEditCancel}>
                                <DialogTitle>Edit Item</DialogTitle>
                                <DialogContent>
                                    <Grid container spacing={2} py={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Description"
                                                value={itemlists.description}
                                                onChange={handleMainChange}
                                                name='description'
                                                fullWidth
                                                disabled={true}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                label="Quantity"
                                                value={itemlists.quantity}
                                                onChange={handleMainChange}
                                                name='quantity'
                                                fullWidth
                                                type='number'
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                label="Unit Price"
                                                value={itemlists.unitPrice}
                                                onChange={handleMainChange}
                                                name='unitPrice'
                                                fullWidth
                                                type='number'
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                label="Discount"
                                                name='discountAmount'
                                                value={itemlists.discountAmount}
                                                onChange={handleMainChange}
                                                fullWidth
                                                type='number'
                                            />
                                        </Grid>
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button variant='outlined' onClick={handleEditCancel} color="error"> Cancel </Button>
                                    <Button variant='outlined' onClick={handleEditSave} color="secondary"> Update </Button>
                                </DialogActions>
                            </Dialog>
                            <div className='remarkNtax'>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: 'background.default',
                                        display: 'grid',
                                        gridTemplateColumns: { md: '1fr 1fr' },
                                        gap: 2,
                                    }}
                                >
                                    <Screens.Item key={1} elevation={2}>
                                        <i style={{ textAlign: 'left', textDecoration: 'underline' }}>Remarks</i>
                                        <p>{header.remarks ? header.remarks : null}</p>
                                    </Screens.Item>
                                    <Screens.Item key={2} elevation={2}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ textAlign: 'left' }}>GROSS TOTAL</td>
                                                    <td style={{ textAlign: 'right' }}>{header.totalAmount || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td>DISOCUNT</td>
                                                    <td>{header.discountAmount || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td>NHIL (2.5%)</td>
                                                    <td>{header.nhil || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td>GETFUND (2.5%)</td>
                                                    <td>{header.getfund || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td>COVID (1%)</td>
                                                    <td>{header.covid || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td>CST (5%)</td>
                                                    <td>{header.cst || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td>TOURISM (1%)</td>
                                                    <td>{header.tourism || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td>VAT (15%)</td>
                                                    <td>{header.totalVat || 0.00}</td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        marginTop: '10px',
                                                        justifyContent: 'space-between',
                                                        fontSize: '17px',
                                                        color: 'darkred',
                                                    }}
                                                >
                                                    <td>NET TOTAL</td>
                                                    <td>{header.currency || 'GHS'}: {header.totalAmount - header.discountAmount || 0.00}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Screens.Item>
                                </Box>
                            </div>
                        </Grid>
                    </div>
                </Screens.Item>
            </Box>
        </ThemeProvider>
    </>);
}

export default InvoiceForm;