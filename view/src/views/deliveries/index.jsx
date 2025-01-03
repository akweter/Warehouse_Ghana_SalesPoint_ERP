import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    IconButton,
    Grid,
    Box,
    DialogContent,
    Typography,
    Dialog,
    DialogTitle,
    Button,
    Paper
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

// projects
import { GeneralCatchError } from '../../utilities/errorAlert';
import DeliveryDetails from './deliveryDetails';
import { fetchDeliveries } from '../../apiActions/allApiCalls/deliveries';
import ReceiptForm from '../receipt/receiptForm';

// /* eslint-disable */
export default function Deliveries() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [receiptFormDialog, openReceiptDialog] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

    useEffect(() => {
        fetchData();
    }, []);

    // Set Data Grid according to screens sizes
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 600);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleCloseDialog = () => setOpenDialog(false);
    const closeReceiptForm = () => openReceiptDialog(false);
    const handleClose = (event, reason) => { if (reason === 'clickaway') { return; } setOpen(false) };

    // Fetch Invoices data from Database
    const fetchData = async () => {
        setLoading(true);
        try {
            const invoicesData = await fetchDeliveries();
            setInvoices(invoicesData);
        }
        catch (error) {
            setInvoices([]);
            setAlert((e) => ({ ...e, message: `Something unexpected happened with\n your connection. \n\n Please log in again if it persist.`, color: 'error' }));
        }
        setOpen(true);
        setLoading(false);
    };
    
    // Format Date and Time to GRA Standard
    const formatDate = (dateString) => {
        const options = { year: 'numeric', day: 'numeric', month: 'numeric'};
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Set Row for DataGrid
    const rowsWithIds = useMemo(() =>
        invoices.length > 0 && invoices.map((invoice, index) => ({
            id: index,
            ...invoice,
            DespatchDate: formatDate(invoice.DespatchDate)
        })),
        [invoices]
    );

    // Set column for DataGrid
    const columns = useMemo(() => {
        if (isSmallScreen) {
            return [
                {
                    field: 'CustomerName',
                    headerName: 'Customer',
                    description: 'Customer Name',
                    flex: 2,
                    width: 200,
                    headerClassName: 'dataGridheader',
                },
                {
                    field: 'actions',
                    headerName: '',
                    flex: 1,
                    width: 20,
                    sortable: false,
                    headerClassName: 'dataGridheader',
                    renderCell: (params) => (<>
                        <IconButton title='View Details' onClick={() => handleWaybilInfo(params.row)}>
                            <VisibilityIcon fontSize='medium' color='primary'/>
                        </IconButton>
                    </>),
                },
                {
                    field: 'receipt',
                    headerName: '',
                    flex: 1,
                    width: 100,
                    sortable: false,
                    headerClassName: 'dataGridheader',
                    renderCell: (params) => (<>
                        <Button variant='text' onClick={() => handleReceiptPrint(params.row)}>
                            <Typography title='Print Receipt'>Print Receipt</Typography>
                        </Button>
                    </>),
                }
            ]
        }
        return [
            {
                field: 'id',
                headerName: '#',
                width: 10,
                renderCell: (params) => {
                    return params.row.id + 1;
                },
                headerClassName: 'dataGridheader',
            },
            {
                field: 'IssuerName',
                headerName: 'Issuer',
                description: 'Served By',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'InvoiceNumber',
                headerName: 'Invoice #',
                description: 'Invoice number',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'CustomerName',
                headerName: 'Customer',
                description: 'Customer Name',
                flex: 2,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'RecipientName',
                headerName: 'Recipient',
                description: 'Recipient Name',
                flex: 1,
                width: 50,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'DespatchDate',
                headerName: 'Date',
                description: 'Despatch Date',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'actions',
                headerName: 'View',
                flex: 1,
                sortable: false,
                headerClassName: 'dataGridheader',
                renderCell: (params) => (<>
                    <IconButton title='View Details' onClick={() => handleWaybilInfo(params.row)}>
                        <VisibilityIcon fontSize='medium' color='primary'/>
                    </IconButton>
                </>),
            },
            {
                field: 'receipt',
                headerName: 'Action',
                flex: 1,
                sortable: false,
                headerClassName: 'dataGridheader',
                renderCell: (params) => (<>
                    <Button variant='text' onClick={() => handleReceiptPrint(params.row)}>
                        <Typography title='Print Receipt'>Print Receipt</Typography>
                    </Button>
                </>),
            }
        ]
    });

    // Open invoice view
    const handleWaybilInfo = (row) => {
        setSelectedRow(row);
        setOpenDialog(true);
    };

    // Open receipt view
    const handleReceiptPrint = (row) => {
        setSelectedRow(row);
        openReceiptDialog(true);
    };

    return (
        <Paper>
            {alert.message && <GeneralCatchError alert={alert} handleClose={handleClose} open={open} />}
            <Grid container justifyContent='space-evenly'
                style={{
                    paddingTop: 5,
                    paddingBottom: 5,
                }}
            >
                <Grid item>
                    <Typography variant='h3'>Deliveries</Typography>
                </Grid>
            </Grid>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rowsWithIds}
                    columns={columns}
                    loading={loading ? loading : null}
                    density='compact'
                    editMode='cell'
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
            </Box>
            <Dialog
                open={openDialog}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle sx={{ backgroundColor: 'darkblue', display: 'flex', justifyContent: 'space-between' }}>
                    <div/>
                    <Typography sx={{ fontSize: '28px', color: 'white' }}>Delivery Details</Typography>
                    <IconButton onClick={handleCloseDialog} color='secondary'>
                        <Typography fontSize='1em' color='red'>Close</Typography>
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ padding: '20px' }}>
                    <DeliveryDetails
                        selectedRow={selectedRow}                    
                        close={handleClose}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={receiptFormDialog} fullScreen>
                <DialogTitle sx={{ backgroundColor: 'darkblue' }}>
                    <IconButton onClick={closeReceiptForm} color='secondary' sx={{ textAlign: 'right' }}>
                        <Typography fontSize='1em' color='red'>Cancel</Typography>
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ padding: '20px' }}>
                    <ReceiptForm
                        closePopup={closeReceiptForm}
                        formData={selectedRow}
                    />
                </DialogContent>
            </Dialog>
        </Paper>
    );
}
