import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
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
    Paper,
    TableBody,
    Typography,
} from '@mui/material';
import { LoadingSpinner } from 'ui-component/loaderAPI';
import { fetchTenInvoices } from 'apiActions/allApiCalls/invoice';
import { fetchAllCustomers } from 'apiActions/allApiCalls/customer';
import { fetchAllProducts } from 'apiActions/allApiCalls/product';
import { GeneralCatchError } from 'utilities/errorAlert';

/* eslint-disable */

export default function DashBoardInvoice() {
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [alert, setAlert] = useState({message: '', color: ''});

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch all invoices
            const invoicesData = await fetchTenInvoices();

            // Fetch all customers
            const customersData = await fetchAllCustomers();

            const tinToNameMap = {};
            customersData.forEach(customer => { tinToNameMap[customer.SnC_tin] = customer.SnC_name; });

            // Fetch all products
            const productsData = await fetchAllProducts();

            const productIdToProductMap = {};
            productsData.forEach(product => {
                productIdToProductMap[product.Itm_id] = {
                    id: product.Itm_id,
                    name: product.Itm_name,
                    category: product.Itm_taxable,
                    itmDiscount: product.Inv_Product_Discount,
                    uom: product.Itm_UOM,
                };
            });
            // Update invoices with product details
            const invoicesWithProducts = invoicesData.map(invoice => {
                try{
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
                            uom: productDetails.uom,
                        };
                    }).filter(product => product !== null);

                    const customerDetails = customersData.find(customer => customer.SnC_tin === invoice.Inv_Customer_Tin) || {};
                    const totalProducts = productsWithQty.reduce((total, item) => total + parseFloat(item.quantity || 0), 0);

                    return {
                        ...invoice,
                        invDate: invDate,
                        customerName: tinToNameMap[invoice.Inv_Customer_Tin] || 'Cash',
                        customerPhone: customerDetails.SnC_phone || '',
                        products: productsWithQty,
                        productsTotal: totalProducts,
                    };
                }
                catch(mapError){
                    return null;
                }
            }).filter(invoice => invoice !== null);
            setTimeout(() => {
                setInvoices(invoicesWithProducts);
                setLoading(false);
            }, 900);
        }
        catch (error) {
            setInvoices([]);
            setOpenDialog(true);
            setAlert((e) => ({ ...e, message: `Something unexpected happened with\n your connection. \n\n Please log in again if it persist.`, color: 'error' }));
            setLoading(false);
        }
    };
    fetchData();
    }, []);

    const rowsWithIds = useMemo(() =>
        invoices.map((invoice, index) => ({
            id: index + 1,
            ...invoice,
            Inv_date: formatDate(invoice.Inv_date),
        })),
        [invoices]
    );

    const columns = useMemo(() => {
        return [
            {
                field: 'id',
                headerName: '#',
                description: 'Item Number',
                // flex: 1,
                width: 10,
            },
            {
                field: 'Inv_user',
                headerName: 'User Name',
                description: 'Served By',
                flex: 1,
                width: 100,
            },
            {
                field: 'Inv_Number',
                headerName: 'Invoice #',
                description: 'Invoice number',
                flex: 1,
                width: 100,
            },
            {
                field: 'customerName',
                headerName: 'Customer',
                description: 'Customer Name',
                flex: 1,
                width: 150,
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
                headerName: 'View',
                flex: 1,
                width: 50,
                sortable: false,
                renderCell: (params) => (<>
                    <IconButton title='View Invoice' onClick={() => handleViewIconClick(params.row)}>
                        <VisibilityIcon fontSize='small' color='info'/>
                    </IconButton>
                </>),
            },
        ]
    });

    const handleViewIconClick = (row) => {
        setSelectedRow(row);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <div>
            {
                alert.message ?
                    <GeneralCatchError alert={alert} handleClose={handleCloseDialog} open={openDialog} /> :
                    null
            }
            {
                loading ?
                <LoadingSpinner /> :
                <Box sx={{ height: 300, width: '100%' }}>
                    <DataGrid
                        rows={rowsWithIds}
                        columns={columns}
                        density='compact'
                        hideFooter={true}
                        hideFooterPagination={true}
                        disableRowSelectionOnClick={true}
                        hideFooterSelectedRowCount={true}
                        filterMode='server'
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                    />
                    {selectedRow && (
                        <Dialog open={openDialog} onClose={handleCloseDialog}>
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
                                                <TableCell component="th" scope="row">Invoice Status:</TableCell>
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
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedRow.products.map((product, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{product.name}</TableCell>
                                                        <TableCell>{selectedRow.currency} {product.price}</TableCell>
                                                        <TableCell>{product.quantity}</TableCell>
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
        </div>
    );
}
