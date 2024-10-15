import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    IconButton,
    Grid,
    Box,
    DialogContent,
    Typography,
    Button,
    Dialog,
    DialogTitle
} from '@mui/material';

// projects
import { fetchQuoteInvoices } from '../../apiActions/allApiCalls/invoice';
import { AlertError, GeneralCatchError } from '../../utilities/errorAlert';
import ProductPlaceholder from '../../ui-component/cards/Skeleton/ProductPlaceholder';
import WaybillForm from './waybilForm';
import { Close } from '@mui/icons-material';

// /* eslint-disable */
export default function OrderCheckout() {
    const [submitted, setSubmitted] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [notify, setNotify] = useState({ message: '', color: '' });
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

    useEffect(() => {
        fetchData();
    }, [submitted]);

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
    const handleClose = (event, reason) => { if (reason === 'clickaway') { return; } setOpen(false) };

    // Fetch Invoices data from Database
    const fetchData = async () => {
        try {
            setLoading(true);
            const invoicesData = await fetchQuoteInvoices();
            setInvoices(invoicesData);
            setTimeout(() => {
                setLoading(false);
                setSubmitted(false);
            }, 1900);
        }
        catch (error) {
            setInvoices([]);
            setAlert((e) => ({ ...e, message: `Something unexpected happened with\n your connection. \n\n Please log in again if it persist.`, color: 'error' }));
            setOpen(true);
            setLoading(true);
        }
    };

    // Format Date and Time to GRA Standard
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Set Row for DataGrid
    const rowsWithIds = useMemo(() =>
        invoices.map((invoice, index) => ({
            id: index,
            ...invoice,
            InvoiceDate: formatDate(invoice.InvoiceDate)
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
                    width: 100,
                    sortable: false,
                    headerClassName: 'dataGridheader',
                    renderCell: (params) => (<>
                        <IconButton title='View Invoice' onClick={() => handleWaybilInfo(params.row)}>
                            <Button >Despatch</Button>
                        </IconButton>
                    </>),
                },
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
                field: 'InvoiceDate',
                headerName: 'Date',
                description: 'Transaction Date',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'TotalAmount',
                headerName: 'Total Amt',
                description: 'Total Invoice Amount',
                flex: 1,
                width: 50,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'VatAmount',
                headerName: 'VAT',
                description: 'Total Invoice VAT',
                flex: 1,
                width: 50,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'actions',
                headerName: '',
                flex: 1,
                width: 70,
                sortable: false,
                headerClassName: 'dataGridheader',
                renderCell: (params) => (<>
                    <IconButton title='View Invoice' onClick={() => handleWaybilInfo(params.row)}>
                        <Button >Despatch</Button>
                    </IconButton>
                </>),
            },
        ]
    });

    // Open invoice view
    const handleWaybilInfo = (row) => {
        setSelectedRow(row);
        setOpenDialog(true);
    };

    const sendPayload = async () => {
        try {
            await new Promise((resolve) => {
                setNotify((e) => ({ ...e, message: '', color: '' }));
                setOpenConfirm(false);
                setTimeout(resolve, 2000);
            });
            // Post Checkout Waylill to backend
            // await postWayillData(selectedRow);
            setNotify((e) => ({ ...e, message: "Invoice submitted to GRA success!", color: 'success' }));
            setOpen(true);
            fetchData();
        }
        catch (error) {
            setNotify((e) => ({ ...e, message: "Invoice submitted to GRA failed!", color: 'error' }));
            setOpen(true);
        }
    }

    return (
        <div>
            <Grid container justifyContent='space-evenly'
                style={{
                    backgroundColor: 'darkblue',
                    paddingTop: 5,
                    paddingBottom: 5,
                }}
            >
                <Grid item>
                    <Typography color='white' variant='h3'>Outsource Paid Invoices</Typography>
                </Grid>
            </Grid>
            {
                invoices.length > 0 ?
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
                    </Box> :
                    < ProductPlaceholder />
            }
            {alert.message ? <GeneralCatchError alert={alert} handleClose={handleClose} open={open} /> : null}
            {notify.message ? <AlertError alert={notify} handleClose={handleClose} open={open} /> : null}

            <Dialog open={openDialog} fullScreen>
                <DialogTitle sx={{ backgroundColor: 'darkblue' }}>
                    <IconButton onClick={handleCloseDialog} color='secondary' sx={{ justifyContent: 'flex-end' }}>
                        <Typography fontSize='1em' color='red'>Cancel</Typography> 
                        <Close color='error' fontSize='medium'/>
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ padding: '20px' }}>
                    <WaybillForm
                        formData={selectedRow}
                        sendPayload={sendPayload}
                        closePopup={handleCloseDialog}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
