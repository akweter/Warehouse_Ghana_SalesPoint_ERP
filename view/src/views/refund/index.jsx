import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { 
    Button,
    Dialog, 
    DialogActions, 
    DialogContent, 
    IconButton, 
    Table, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow,
    TableBody,
    Paper, 
    Typography,
    Grid,
    Drawer,
} from '@mui/material';
import { LoadingSpinner } from 'ui-component/loaderAPI';
import { GeneralCatchError } from 'utilities/errorAlert';
import RefundCancellationForm from './refundCancelation';
import DrawerContent from './showCancelRefunds';
import { fetchAllCustomers } from 'apiActions/allApiCalls/customer';
import { fetchAllProducts } from 'apiActions/allApiCalls/product';
import { fetchRefundInvoices } from 'apiActions/allApiCalls/refund';
import { IconCreditCardRefund } from '@tabler/icons-react';

/* eslint-disable */

export default function Refund() {
    const [open, setOpen] = useState(false);
    const [openRefDialog, setOpenRefDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openGeneralCatch, setOpenGeneralCatch] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [refundInv, setRefundInv] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [alert, setAlert] = useState({message: '', color: ''});

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        fetchData();
    }, [submitted]);

    const fetchData = async () => {
        try {
            // Fetch all refund invoices
            setLoading(true);
            const invoicesData = await fetchRefundInvoices();

            // Fetch all customers
            const customersData = await fetchAllCustomers();

            const tinToNameMap = {};
            customersData.forEach(customer => {
                tinToNameMap[customer.SnC_tin] = customer.SnC_name;
            });

            // Fetch products
            const productsData = await fetchAllProducts();

            const productIdToProductMap = {};
            productsData.forEach(product => {
                productIdToProductMap[product.Itm_id] = {
                    id: product.Itm_id,
                    name: product.Itm_name,
                    category: product.Itm_taxable,
                    itmDiscount: product.Inv_Product_Discount,
                };
            });

            // Update invoices with product details
            const invoicesWithProducts = invoicesData.map(invoice => {
                const productIds = JSON.parse(invoice.Inv_Product_id);
                const productQtys = JSON.parse(invoice.Inv_Product_qty);
                const productDis = JSON.parse(invoice.Inv_Product_Discount);
                const productPrice = JSON.parse(invoice.Inv_Pro_Price);
                const invDate = invoice.Inv_date;

                const productsWithQty = productIds.map((productId, index) => {
                    const productDetails = productIdToProductMap[productId];
                    if (!productDetails) {
                        return null;
                    }
                    return {
                        id: productDetails.id,
                        name: productDetails.name,
                        quantity: parseFloat(productQtys[index]),
                        price: parseFloat(productPrice[index]),
                        category: productDetails.category,
                        discount: parseFloat(productDis[index]),
                    };
                }).filter(product => product !== null);

                return {
                    ...invoice,
                    invDate: invDate,
                    customerName: tinToNameMap[invoice.Inv_Customer_Tin] || 'Cash',
                    products: productsWithQty,
                };
            });
            setTimeout(() => {
                setInvoices(invoicesWithProducts);
                setLoading(false);
            }, 2000);
        }
        catch (error) {
            setInvoices([]);
            setOpenGeneralCatch(true);
            setAlert((e) => ({...e, message: `Something unexpected happened with\n your connection or server interrupted. \n\n Please log in again if it persist.`, color: 'error'}));
            setLoading(false);
        }
    };
    
    const rowsWithIds = useMemo(() =>
        invoices.map((invoice) => ({
            id: uuidv4(),
            ...invoice,
            Inv_date: formatDate(invoice.Inv_date),
        })),
        [invoices]
    );

    const columns = useMemo(() => {
        return [
            {
                field: 'Inv_user',
                headerName: 'Issuer',
                description: 'Served By',
                flex: 1,
                width: 50,
            },
            {
                field: 'Inv_Number',
                headerName: 'Invoice #',
                description: 'Invoice number',
                flex: 1,
                width: 50,
            },
            {
                field: 'Inv_Reference',
                headerName: 'Refund Ref',
                description: 'Refund Reference',
                flex: 1,
                width: 100,
            },
            {
                field: 'Inv_date',
                headerName: 'Date',
                description: 'Transaction Date',
                flex: 1,
                width: 70,
            },
            {
                field: 'customerName',
                headerName: 'Customer',
                description: 'Customer Name',
                flex: 1,
                width: 100,
            },
            {
                field: 'Inv_status',
                headerName: 'Transaction',
                description: 'Transaction Type',
                flex: 1,
                width: 120,
            },
            {
                field: 'Inv_total_amt',
                headerName: 'Total Amt',
                description: 'Total Invoice Amount',
                flex: 1,
                width: 50,
            },
            {
                field: 'Inv_levies',
                headerName: 'Levies',
                description: 'Total Invoice Levies',
                flex: 1,
                width: 40,
                valueGetter: (params) => {
                    const cst = parseFloat(params.row.cst) || 0;
                    const nhil = parseFloat(params.row.nhil) || 0;
                    const getfund = parseFloat(params.row.getfund) || 0;
                    const covid = parseFloat(params.row.covid) || 0;
                    const totalLevies = cst + nhil + getfund + covid;
                    return totalLevies.toFixed(2);
                },
            },
            {
                field: 'Inv_vat',
                headerName: 'VAT',
                description: 'Total Invoice VAT',
                flex: 1,
                width: 80,
            },
            {
                field: 'actions',
                headerName: 'ACTIONS',
                flex: 1,
                width: 150,
                sortable: false,
                renderCell: (params) => (<>
                    <IconButton title='View Refund' onClick={() => handleViewIconClick(params.row)}>
                        <VisibilityIcon fontSize='medium' color='secondary'/>
                    </IconButton>
                    <IconButton title='Cancel Refund' onClick={()=> handleRefundBtnClick(params.row)}>
                        <IconCreditCardRefund color='red'/>
                    </IconButton>
                </>),
            },
        ]
    });
    
    const handleViewIconClick = (row) => {
        setSelectedRow(row);
        setOpenDialog(true);
    };
    
    const handleRefundBtnClick = (row) => {
        setRefundInv(row);
        setOpenRefDialog(true);
    }

    const handleCloseRefDialog = () => {
        setOpenRefDialog(false);
    };

    const handleCloseDialog = () =>{
        setOpenDialog(false);
    }

    const handleClose = (event, reason) => { if (reason === 'clickaway') { return; } setOpen(false); };

    const toggleDrawer = (status) => () => {
        setOpen(status);
    };

    return (
        <div>
            <Grid container sx={{justifyContent: 'space-between'}}>
                <h2>Refund Transactions</h2>
                <IconButton onClick={toggleDrawer(true)} size='large' edge="end" color="secondary">
                    <MenuIcon color='secondary'/>
                </IconButton>
            </Grid>
            {
                loading ?
                <LoadingSpinner /> :
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={rowsWithIds}
                        columns={columns}
                        density='compact'
                        pageSize={5}
                        disableRowSelectionOnClick={true}
                        slots={{ toolbar: GridToolbar }}
                        hideFooterSelectedRowCount={true}
                        filterMode='client'
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                    />
                    {alert.message ? <GeneralCatchError alert={alert} open={openGeneralCatch}/> : null}
                    {selectedRow && (
                        <Dialog open={openDialog} onClose={false}>
                            <DialogContent>
                                <Typography sx={{ fontSize: '22px', textAlign: "center", fontWeight: '600', fontStyle: 'italic' }}>Invoice Details</Typography>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 500, borderCollapse: 'collapse' }} size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Invoice #:</TableCell>
                                                <TableCell component="td" scope="row">{selectedRow.Inv_Number}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Served By:</TableCell>
                                                <TableCell component="td" scope="row">{selectedRow.Inv_user}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Customer Name:</TableCell>
                                                <TableCell component="td" scope="row">{selectedRow.customerName}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Customer TIN:</TableCell>
                                                <TableCell component="td" scope="row">{selectedRow.Inv_Customer_Tin}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Transaction Date:</TableCell>
                                                <TableCell component="td" scope="row">{selectedRow.Inv_date}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Invoice Type:</TableCell>
                                                <TableCell component="td" scope="row">{selectedRow.Inv_Type}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Refund Type:</TableCell>
                                                <TableCell component="td" scope="row">{selectedRow.Inv_status}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Discount:</TableCell>
                                                <TableCell component="td" scope="row">{selectedRow.currency} {selectedRow.Inv_discount}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Total VAT:</TableCell>
                                                <TableCell component="td" scope="row">{selectedRow.currency} {selectedRow.Inv_vat}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Total Levies:</TableCell>
                                                <TableCell component="td" scope="row">{selectedRow.currency} {(
                                                        parseFloat(selectedRow.cst) +
                                                        parseFloat(selectedRow.nhil) +
                                                        parseFloat(selectedRow.getfund) +
                                                        parseFloat(selectedRow.covid) +
                                                        parseFloat(selectedRow.tourism)
                                                    ).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell component="th" scope="row">Total Amount:</TableCell>
                                                <TableCell component="td" scope="row">{selectedRow.currency} {selectedRow.Inv_total_amt}</TableCell>
                                            </TableRow>
                                        </TableHead>
                                    </Table>
                                </TableContainer>

                                {/* Products table... */}
                                {Array.isArray(selectedRow.products) && selectedRow.products.length > 0 ? (
                                    <TableContainer component={Paper} sx={{ marginTop: '10px' }}>
                                        <Table sx={{ minWidth: 500, borderCollapse: 'collapse' }} size='small'>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Product</TableCell>
                                                    <TableCell>Price</TableCell>
                                                    <TableCell>Quantity</TableCell>
                                                    <TableCell>Discount</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedRow.products.map((product, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{product.name}</TableCell>
                                                        <TableCell>{product.price}</TableCell>
                                                        <TableCell>{product.quantity}</TableCell>
                                                        <TableCell>{product.discount}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <p>Products not available</p>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Close</Button>
                            </DialogActions>
                        </Dialog>
                    )}
                </Box>
            }
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                < DrawerContent />
            </Drawer>
            <RefundCancellationForm 
                open={openRefDialog}
                handleClose={handleCloseRefDialog} 
                refData={refundInv ? refundInv : null}
                setSubmitted={setSubmitted}
            />
        </div>
    );
}
