import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
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
    Typography,
} from '@mui/material';
import API_URL from 'api_origin';

export default function DashboardPurchase() {
    const [invoices, setInvoices] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch invoices
                const invoicesResponse = await fetch(`${API_URL.BACK_ORIGIN}/invoices`);

                if (invoicesResponse.ok) {
                    const invoicesData = await invoicesResponse.json();
                    
                    // Fetch customers
                    const customersResponse = await fetch(`${API_URL.BACK_ORIGIN}/customers`);
                    if (customersResponse.ok) {
                        const customersData = await customersResponse.json();

                        const tinToNameMap = {};
                        customersData.forEach(customer => {
                            tinToNameMap[customer.SnC_tin] = customer.SnC_name;
                        });

                        // Fetch products
                        const productsResponse = await fetch(`${API_URL.BACK_ORIGIN}/product`);
                        if (productsResponse.ok) {
                            const productsData = await productsResponse.json();
                            
                            const productIdToProductMap = {};
                            productsData.forEach(product => {
                                productIdToProductMap[product.productID] = product.productName;
                            });

                            // Update invoices with product details
                            const invoicesWithProducts = invoicesData.map(invoice => {
                                const productIds = JSON.parse(invoice.Inv_Product_id);
                            
                                // Map product IDs to their details
                                const products = productIds.map(productId => productIdToProductMap[productId]);
                            
                                return {
                                    ...invoice,
                                    customerName: tinToNameMap[invoice.Inv_Customer_Tin] || 'Cash',
                                    products: products,
                                };
                            });
                            setInvoices(invoicesWithProducts.slice(0, 15));
                        } else {
                            setInvoices([]);
                        }
                    }
                    else {
                        setInvoices([]);
                    }
                }
                else {
                    setInvoices([]);
                }
            }
            catch (error) {
                window.alert('Network Error! Please refresh');
            }
        };
        fetchData();
    }, []);

    const rowsWithIds = useMemo(() =>
        invoices.map((invoice) => ({
            id: uuidv4(),
            ...invoice,
            Inv_date: formatDate(invoice.Inv_date),
            Inv_taxes: parseFloat(invoice.Inv_vat + invoice.Inv_levies).toFixed(2),
        })),
        [invoices]
    );

    const columns = useMemo(() => {
        return [
            {
                field: 'Inv_user',
                headerName: 'USER',
                description: 'Served By',
                flex: 1,
                width: 70,
            },
            {
                field: 'Inv_Number',
                headerName: 'INVOICE #',
                description: 'Invoice number',
                flex: 1,
                width: 70,
            },
            {
                field: 'customerName',
                headerName: 'CUSTOMER',
                description: 'Customer Name',
                flex: 1,
                width: 50,
            },
            {
                field: 'Inv_total_amt',
                headerName: 'TOTAL AMT',
                description: 'Total Invoice Amount',
                flex: 1,
                width: 50,
            },
            {
                field: 'Inv_taxes',
                headerName: 'TAXES',
                description: 'Total taxes',
                flex: 1,
                width: 40,
            },
            {
                field: 'actions',
                headerName: 'VIEW',
                flex: 1,
                width: 150,
                sortable: false,
                renderCell: (params) => (<>
                    <IconButton onClick={() => handleViewIconClick(params.row)}>
                        <VisibilityIcon fontSize='small' color='primary'/>
                    </IconButton>
                </>)
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
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rowsWithIds}
                    columns={columns}
                    density='compact'
                    pageSize={5}
                    disableRowSelectionOnClick={true}
                    hideFooter={true}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                />
                {selectedRow && (
                    <Dialog open={openDialog} onClose={handleCloseDialog}>
                        <DialogContent>
                            <Typography sx={{fontSize: '22px', textAlign: "center", fontWeight: '600', fontStyle: 'italic'}}>Invoice Details</Typography>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 500, borderCollapse: 'collapse' }} size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th" scope="row">INVOICE NUMBER:</TableCell>
                                            <TableCell component="td" scope="row">{selectedRow.Inv_Number}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">CUSTOMER:</TableCell>
                                            <TableCell component="td" scope="row">{selectedRow.customerName}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">CUSTOMER TIN:</TableCell>
                                            <TableCell component="td" scope="row">{selectedRow.Inv_Customer_Tin}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">SERVED BY:</TableCell>
                                            <TableCell component="td" scope="row">{selectedRow.Inv_user}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">TRANSACTION DATE:</TableCell>
                                            <TableCell component="td" scope="row">{selectedRow.Inv_date}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">CURRENCY:</TableCell>
                                            <TableCell component="td" scope="row">{selectedRow.currency}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">PRODUCTS QTY:</TableCell>
                                            <TableCell component="td" scope="row">{selectedRow.Inv_Product_qty}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">TOTAL AMT:</TableCell>
                                            <TableCell component="td" scope="row">{selectedRow.Inv_total_amt}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">TOTAL DISCOUNT:</TableCell>
                                            <TableCell component="td" scope="row">{selectedRow.Inv_discount}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">NHIL LEVY:</TableCell>
                                            <TableCell component="td" scope="row">{((2.5)/6*(selectedRow.Inv_levies)).toFixed(2)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">GETFUND LEVY:</TableCell>
                                            <TableCell component="td" scope="row">{((2.5)/6*(selectedRow.Inv_levies)).toFixed(2)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">COVID LEVY:</TableCell>
                                            <TableCell component="td" scope="row">{(1/6*(selectedRow.Inv_levies)).toFixed(2)}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">VAT:</TableCell>
                                            <TableCell component="td" scope="row">{selectedRow.Inv_vat}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell component="th" scope="row">TOTAL LEVIES:</TableCell>
                                            <TableCell component="td" scope="row">{selectedRow.Inv_levies}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>
                            <h3>Products:</h3>
                            {Array.isArray(selectedRow.products) && selectedRow.products.length > 0 ? (
                                <ul>
                                    {selectedRow.products.map((product, index) => (
                                        <li key={index}>{product}</li>
                                    ))}
                                </ul>
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
        </div>
    );
}
