import React, { useState, useEffect } from 'react';
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
    Container,
    TextareaAutosize,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import dayjs from 'dayjs';

// /* eslint-disable */

// Projects
import '../../assets/css/form.css';
import Screens from '../../ui-component/cardDivision';
import { headerPayload, itemlistPayload } from '../../views/payload/payloadStructure';
import { AlertError } from '../../utilities/errorAlert';
import { ShowBackDrop } from '../../utilities/backdrop';
import { fetchAutocompleteId, postGRAInvoiceCallback, postNewGRAInvoice } from '../../apiActions/allApiCalls/invoice';
import { fetchProductNameSearch } from '../../apiActions/allApiCalls/product';
import { fetchCustomerNameSearch } from '../../apiActions/allApiCalls/customer';
import { computeStandardTaxes } from '../../utilities/computeAllTaxes';
 
const InvoiceForm = ({ quoteProducts, setSubmitted, setDrop, drop, BackdropOpen, callBack, setCallBack }) => {
    const [open, setOpen] = useState(false);
    const [compute, setCompute] = useState(false);
    const [cashCustomer, setCashCustomer] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [allSearch, SetAllSearch] = useState({ product: ([]), customer: ([]) });
    const [header, setHeader] = useState(headerPayload);
    const [itemlists, setItemLists] = useState(itemlistPayload);
    const [alert, setAlert] = useState({ message: '', color: 'success' });

    // update the header and item state for qutation edit
    useEffect(() => {
        if (quoteProducts) {
            const {
                CustomerTIN,
                InvoiceNumber,
                ExchangeRate,
                Currency,
                CalculationType,
                CustomerName,
                products,
                Remarks,
                SaleType,
                DiscountType,
                // InvoiceDate,
                COVID,
                CST,
                GETFund,
                NHIL,
                TotalAmount,
                Tourism,
                VatAmount,
                customerPhone,
                IssuerName,
                CustomerID,
                checkdID,
            } = quoteProducts;
            const headerDiscount = products.reduce((ProductDiscount, item) => ProductDiscount + parseFloat(item.ProductDiscount || 0), 0);
            setHeader((state) => ({
                ...state,
                currency: Currency,
                exchangeRate: ExchangeRate,
                invoiceNumber: InvoiceNumber,
                totalLevy: Number(COVID + CST, GETFund, NHIL + Tourism),
                userName: IssuerName,
                flag: "Proforma Invoice",
                calculationType: CalculationType,
                totalVat: VatAmount,
                totalAmount: TotalAmount,
                voucherAmount: "",
                businessPartnerName: CustomerName,
                businessPartnerTin: CustomerTIN,
                saleType: SaleType,
                discountType: DiscountType,
                discountAmount: headerDiscount,
                reference: "",
                groupReferenceId: "",
                purchaseOrderReference: "",
                invoiceType: "Proforma Invoice",
                invCusId: CustomerID,
                remarks: Remarks,
                status: "Proforma Invoice",
                userPhone: customerPhone,
                delivery: "",
                infoMsg: "quoteEdit",
                nhil: NHIL,
                getfund: GETFund,
                covid: COVID,
                cst: CST,
                tourism: Tourism,
                checkdID: checkdID
            }));
            // Set items state
            if (Array.isArray(products) && products.length > 0) {
                const updatedItemLists = products.map((e) => {
                    return {
                        itemCode: e.itemCode,
                        itemCategory: e.ProductCategory,
                        expireDate: "",
                        description: e.ProductName,
                        quantity: e.Quantity,
                        levyAmountA: "",
                        levyAmountB: "",
                        levyAmountC: "",
                        levyAmountD: "",
                        levyAmountE: "",
                        discountAmount: e.ProductDiscount,
                        batchCode: "",
                        unitPrice: e.ProductPrice,
                        refProQty: e.RefundedQuantity,
                        invProID: e.IPID,
                    };
                });
                setHeader((state) => ({ ...state, items: updatedItemLists }));
            }
            setCompute(true);
        }
    }, [])

    // Make call back when the call back state is triggered from the index (main component)
    useEffect(() => {
        if (callBack) {
            setHeader((state) => {
                const newState = { ...state, callback: "yes" };
                return newState;
            });
            submitFormToGRA();
            setCallBack(false);
        }
    }, [callBack]);
    
    useEffect(() => {
        setUserName();
        setInvoiceNumber();
    },[header.invoiceNumber, header.userName]);

    // disable customer cash && Update currency for Ghana cedis.
    useEffect(() => {
        const { currency } = header;
        if (currency === 'GHS') {
            setHeader(state => ({ ...state, exchangeRate: '1.0' }));
        }
        if (cashCustomer === true) {
            setHeader(state => ({ ...state, businessPartnerTin: 'C0000000000' }));
        }
    }, [header.currency, header.exchangeRate, header.businessPartnerTin, header, cashCustomer]);

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
            setHeader((state) => ({
                ...state,
                totalAmount: Number(totalAmount || 0.00),
                voucherAmount: Number(voucherAmount || 0.00),
                discountAmount: Number(discountAmount || 0.00),
                totalLevy: Number(totalLevy || 0.00),
                nhil: Number(nhil || 0.00),
                getfund: Number(getfund || 0.00),
                tourism: Number(tourism || 0.00),
                covid: Number(covid || 0.00),
                items: items,
                cst: Number(cst || 0.00),
                totalVat: Number(totalVat || 0.00),
            }));
        }
        setTimeout(() => {
            setCompute(false);
        }, 1000);
    }, [compute, header]);

    // search product and customer information
    const fetchProductsCustomers = async() => {
        try {
            setLoading(true);
            if (allSearch.customer.length < 1) {
                const result = await fetchCustomerNameSearch(allSearch.customer);
                SetAllSearch((prevState) => ({ 
                    ...prevState, 
                    customer: Array.isArray(result) 
                    ? result.sort((a, b) => a.customerName.localeCompare(b.customerName)) 
                    : [],
                }));
            }
            if (allSearch.product.length < 1) {
                const data = await fetchProductNameSearch(allSearch.product);
                SetAllSearch((prevState) => ({ 
                    ...prevState, 
                    product: Array.isArray(data) 
                    ? data.sort((a, b) => a.productName.localeCompare(b.productName)) 
                    : [],
                }));
            }
        }
        catch (error) {
            setLoading(false);
        }
        setLoading(false);
    }

    // Set Invoice Number
    const setInvoiceNumber = async () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear() % 100;
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        if (!quoteProducts || quoteProducts.InvoiceNumber === "") {
            try {
                const response = await fetchAutocompleteId();
                const number = response[0].numList + 1;
                const output = `WG${year}M${month}${day}${number}CSD`;
                setHeader((state) => ({ ...state, invoiceNumber: output }));
            }
            catch (error) {
                let num = Math.floor(Math.random() * 100) + 1;
                const output = `WG${year}${month}${(day)}-${num}CSD`;
                setHeader((state) => ({ ...state, invoiceNumber: output }));
            }
        }
    }

    // Get userName
    const setUserName = () => {
        const systemUser = window.localStorage.getItem('userInfo');
        if ( header.userName === "" && systemUser) {
            const parseSystemUser = JSON.parse(systemUser);
            const systemUserName = parseSystemUser.userName;
            if (systemUserName) {
                setHeader((state) => ({ ...state, userName: systemUserName, status: "INVOICE" }));
            } else {
                setHeader((state) => ({ ...state, userName: 'Unknown', status: "INVOICE" }));
            }
        }
    }

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
        else if (discountAmount > (quantity * unitPrice)) {
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
        setCompute(true);
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

    // Check cash customer info
    const CheckCashCustomer = () => {
        setCashCustomer(!cashCustomer);
        setHeader((state) => ({...state, invCusId: "", businessPartnerTin: ""}));
    }

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
        setDrop(true);
        try {
            const data = callBack ? await postGRAInvoiceCallback(header) : await postNewGRAInvoice(header);
            if (data.status === "error") {
                const res = JSON.stringify(data.message);
                setAlert((e) => ({ ...e, message: res, color: 'warning' }));
            }
            else {
                setSubmitted(true);
                setAlert((e) => ({ ...e, message: 'Transaction Succssful!', color: 'success' }));
                setTimeout(() => {
                    BackdropOpen(false);
                }, 1000);
            }
        }
        catch (error) {
            setAlert((e) => ({ ...e, message: "Invoice submission failed! Refresh and try again", color: 'error' }));
        }
        setDrop(false);
        setOpen(true);
    };

    // handle alerts
    const handleClose = (event, reason) => { if (reason === 'clickaway') { return; } setOpen(false); };

    return (<>
        <ThemeProvider theme={Screens.lightTheme}>
            
            { open && <AlertError open={open} alert={alert} handleClose={handleClose} /> }
            { drop && <ShowBackDrop open={drop} /> }

            <Grid container spacing={2} padding={2}>
                <Grid item order={{ xs: 2, md: 1 }} xs={12} md={6}>
                    <Grid container spacing={2} py={3}>
                        <Grid item xs={12} md={cashCustomer === true ? 3 : 6}>
                            <FormControl fullWidth>
                                <ToggleButtonGroup
                                    fullWidth
                                    size='small'
                                    color={header.infoMsg === true ? "primary" : "standard"}
                                    value={header.businessPartnerName || ""}
                                    disabled={header.infoMsg ? true : false}
                                    name="businessPartnerName"
                                    onChange={CheckCashCustomer}
                                >
                                    <ToggleButton color="primary">Customer</ToggleButton>
                                </ToggleButtonGroup>
                            </FormControl>
                        </Grid>
                        {cashCustomer === true ?
                            <Grid item xs={12} md={8}>
                                <FormControl fullWidth>
                                    <TextField
                                        label="Cash Customer Name"
                                        value={header.businessPartnerName}
                                        name='businessPartnerName'
                                        size='small'
                                        onChange={handleMainChange}
                                    />
                                </FormControl>
                            </Grid>
                            :
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth onClick={fetchProductsCustomers}>
                                    <Autocomplete
                                        id="customer-search"
                                        disabled={header.infoMsg ? true : false}
                                        options={allSearch.customer}
                                        loading={loading}
                                        getOptionLabel={(option) => header.businessPartnerName !== 'Cash' ? option.customerName : ''}
                                        onChange={(event, selecteduser) => {
                                            if (selecteduser) {
                                                const customerName = selecteduser.customerName;
                                                setHeader((oldValue) => ({
                                                    ...oldValue,
                                                    businessPartnerName: customerName,
                                                    businessPartnerTin: selecteduser.customerTIN,
                                                    invCusId: selecteduser.customerID,
                                                    userPhone: selecteduser.customerPhone,
                                                }));
                                            }
                                        }}
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
                        }
                        <Grid item xs={12} md={6}>
                            {cashCustomer === true ?
                                <FormControl fullWidth>
                                    <TextField
                                        label="Customer Telephone"
                                        value={header.userPhone}
                                        name='userPhone'
                                        size='small'
                                        onChange={handleMainChange}
                                    />
                                </FormControl>
                                :
                                <FormControl fullWidth>
                                    <InputLabel id="saleType">Sales Type</InputLabel>
                                    <Select
                                        labelId="saleType"
                                        id="saleType"
                                        label="saleType"
                                        name="saleType"
                                        value={header.saleType}
                                        onChange={handleMainChange}
                                        // disabled={header.infoMsg ? true : false}
                                        size='small'
                                    >
                                        <MenuItem value='NORMAL'>Normal</MenuItem>
                                        <MenuItem value='EXPORT'>Export</MenuItem>
                                        <MenuItem value='RENT'>Real Estate</MenuItem>
                                    </Select>
                                </FormControl>
                            }
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="calculationType">Invoice Type</InputLabel>
                                <Select
                                    labelId="calculationType"
                                    // disabled={header.infoMsg ? true : false}
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
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="currency">Currency</InputLabel>
                                <Select
                                    labelId="currency"
                                    id="currency"
                                    label="currency"
                                    name="currency"
                                    size='small'
                                    onChange={handleMainChange}
                                    // disabled={header.infoMsg ? true : false}
                                    value={header.currency}
                                >
                                    <MenuItem value='AED'>UAE Dirham (د.إ)</MenuItem>
                                    <MenuItem value='CAD'>Canadian Dollar (CA$)</MenuItem>
                                    <MenuItem value='CNY'>Chinese Yuan (CN¥)</MenuItem>
                                    <MenuItem value='EUR'>Euro (€)</MenuItem>
                                    <MenuItem value='GBP'>British Pound (£)</MenuItem>
                                    <MenuItem value='GHS'>Ghanaian Cedi (₵)</MenuItem>
                                    <MenuItem value='HKD'>Hong Kong Dollar (HK$)</MenuItem>
                                    <MenuItem value='INR'>Indian Rupee (₹)</MenuItem>
                                    <MenuItem value='JPY'>Japanese Yen (¥)</MenuItem>
                                    <MenuItem value='LRD'>Liberian Dollar (LRD)</MenuItem>
                                    <MenuItem value='NGN'>Nigerian Naira (₦)</MenuItem>
                                    <MenuItem value='USD'>US Dollar ($)</MenuItem>
                                    <MenuItem value='ZAR'>South African Rand (ZAR)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="invoiceType">Transaction Type</InputLabel>
                                <Select
                                    labelId="invoiceType"
                                    id="invoiceType"
                                    label="invoiceType"
                                    name="invoiceType"
                                    size='small'
                                    disabled={header.infoMsg ? true : false}
                                    onChange={handleMainChange}
                                    value={header.invoiceType}
                                >
                                    <MenuItem value='Invoice'>Official Invoice</MenuItem>
                                    <MenuItem value='Proforma Invoice'>Proforma Invoice</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Exchange Rate"
                                    type="number"
                                    value={header.exchangeRate}
                                    name='exchangeRate'
                                    size='small'
                                    onChange={handleMainChange}
                                    // disabled={header.infoMsg ? true : false}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        name="transactionDate"
                                        value={header.transactionDate || null}
                                        format='YYYY-MM-DD'
                                        defaultValue={new Date()}
                                        label="Invoice Date"
                                        maxDate={/*|| header.invoiceType === "Proforma Invoice"*/ dayjs()}
                                        onChange={(e) => {
                                            const selectedDate = e.$d;
                                            const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
                                            setHeader({ ...header, transactionDate: formattedDate });
                                        }}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Delivery/Shipping"
                                    type="text"
                                    value={header.delivery}
                                    name='delivery'
                                    size='small'
                                    onChange={handleMainChange}
                                    // disabled={header.infoMsg ? true : false}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
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
                        <Grid item xs={12} md={12}>
                            <FormControl fullWidth onClick={fetchProductsCustomers}>
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
                                                quantity: 1,
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
                                            key={params.itemCode}
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
                        <Grid item xs={12} md={4}>
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
                        <Grid item xs={12} md={4}>
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
                        <Grid item xs={12} md={4}>
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
                        <Grid item xs={12} md={12}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>Remarks</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TextareaAutosize></TextareaAutosize>
                                    <textarea
                                        rows='100%'
                                        cols={65}
                                        value={header.remarks}
                                        onChange={handleMainChange}
                                        name='remarks'
                                    />
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Stack direction="row" spacing={2}>
                                    <Button onClick={addItemsToBasket} fullWidth color='primary' variant="contained" size='large' startIcon={<AddShoppingCartOutlinedIcon />}>
                                        Add Item
                                    </Button>
                                </Stack>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <Stack direction="row" spacing={2}>
                                    <Button onClick={submitFormToGRA} fullWidth color='success' variant="contained" size='large' startIcon={<SendSharpIcon />}>
                                        Submit
                                    </Button>
                                </Stack>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item order={{ xs: 1, md: 2 }} xs={12} md={6}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={12} md={3}>
                                    <strong>Invoice #: </strong>{header.invoiceNumber}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <strong>Customer: </strong>{header.businessPartnerName}
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    {
                                        header.businessPartnerTin === 'C0000000000' ? (<>
                                        <strong>Phone: </strong>{ header.userPhone}</>) : (<>
                                        <strong>Tin: </strong> {header.businessPartnerTin}</>)
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} pt={2}>
                            <TableContainer component={Paper} style={{ height: 300, width: '100%', overflowX: 'auto' }}>
                                <Table padding='checkbox'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding='checkbox' width='30%'>Description</TableCell>
                                            <TableCell padding='checkbox' width='20%'>Quantity</TableCell>
                                            <TableCell padding='checkbox' width='20%'>Price</TableCell>
                                            <TableCell padding='checkbox' width='20%'>Discount</TableCell>
                                            <TableCell padding='checkbox' width='10%'>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {header.items.map((item, index) => (
                                            <TableRow hover key={index}>
                                                <TableCell padding='checkbox'>{item.description || item.ProductName}</TableCell>
                                                <TableCell padding='checkbox'>{item.quantity || item.Quantity}</TableCell>
                                                <TableCell padding='checkbox'>{item.unitPrice || item.ProductPrice}</TableCell>
                                                <TableCell padding='checkbox'>{item.discountAmount || item.ProductDiscount}</TableCell>
                                                <TableCell padding='checkbox'>
                                                    <Tooltip title="Edit">
                                                        <IconButton onClick={() => handleEdit(index)}>
                                                            <EditIcon color='primary' />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete">
                                                        <IconButton onClick={() => handleDelete(index)}>
                                                            <DeleteIcon color='error' />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Grid container spacing={2} pt={2}>
                                <Grid item xs={12} md={6} padding={2}>
                                    <Paper elevation={2}>
                                        <Typography variant='h6'>Remarks</Typography>
                                        <Container>{header.remarks}</Container>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6} padding={2}>
                                    <Paper elevation={2}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ textAlign: 'left' }} className='td_invoice'>GROSS TOTAL</td>
                                                    <td style={{ textAlign: 'right' }} className='td_invoice'>{header.totalAmount || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td className='td_invoice'>DISOCUNT</td>
                                                    <td className='td_invoice'>{header.discountAmount || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td className='td_invoice'>NHIL (2.5%)</td>
                                                    <td className='td_invoice'>{header.nhil || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td className='td_invoice'>GETFUND (2.5%)</td>
                                                    <td className='td_invoice'>{header.getfund || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td className='td_invoice'>COVID (1%)</td>
                                                    <td className='td_invoice'>{header.covid || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td className='td_invoice'>CST (5%)</td>
                                                    <td className='td_invoice'>{header.cst || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td className='td_invoice'>TOURISM (1%)</td>
                                                    <td className='td_invoice'>{header.tourism || 0.00}</td>
                                                </tr>
                                                <tr className='table'>
                                                    <td className='td_invoice'>VAT (15%)</td>
                                                    <td className='td_invoice'>{header.totalVat || 0.00}</td>
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
                                                    <td>
                                                        {header.currency || 'AMT'}: 
                                                        { header.calculationType !== "INCLUSIVE" ?
                                                            Number(header.totalAmount + header.totalLevy + header.totalVat - header.discountAmount) : 
                                                            Number(header.totalAmount - header.discountAmount) || 0.00
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
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
        </ThemeProvider>
    </>);
}

export default InvoiceForm;
