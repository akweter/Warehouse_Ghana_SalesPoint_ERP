import { useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    Close,
    Print as PrintIcon,
    SendRounded,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import {
    IconButton,
    Grid,
    Box,
    CircularProgress,
    DialogContent,
    Typography,
    DialogActions,
    Button,
    Dialog,
    DialogTitle
} from '@mui/material'
import { checkGRAServerStatus, deleteQuotation, fetchQuoteInvoices, postNewGRAInvoice } from '../../apiActions/allApiCalls/invoice';
import InvoiceDetails from '../invoices/invoiceDetails';
import { AlertError, GeneralCatchError } from '../../utilities/errorAlert';
import ProductPlaceholder from '../../ui-component/cards/Skeleton/ProductPlaceholder';
import InvoiceTemplate from '../invoices/invoiceTemplate';
import { UseFullPayload } from '../invoices/invoiceQuotePayload';
import { formatDate } from '../../utilities/formatDate';

// /* eslint-disable */

export default function SalesReport() {
    const [submitted, setSubmitted] = useState(false);
    const [status, setStatus] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadQuote, setLoadQuote] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openPrintInvoice, setOpenPrintInvoice] = useState(false);
    const [printInvoice, setPrintInvoice] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [header, setHeader] = useState([]);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [notify, setNotify] = useState({ message: '', color: '' });
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

    useEffect(() => {
        fetchData();
        testServer();
    }, [submitted, status]);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 600);
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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

    // Test GRA Server Up
    const testServer = async () => {
        try {
            await checkGRAServerStatus();
            setStatus(true);
        }
        catch (error) {
            setStatus(false);
        }
    };

    // Sum Levied together
    const Levies = (invoice) => {
        const { NHIL, GETFund, COVID, CST, Tourism } = invoice;
        const totalLevies = NHIL + GETFund + COVID + CST + Tourism;
        return parseFloat(totalLevies);
    };

    // Set Row for DataGrid
    const rowsWithIds = useMemo(() =>
        invoices.length > 0 && invoices.map((invoice, index) => ({
            id: index,
            ...invoice,
            InvoiceDate: formatDate(invoice.InvoiceDate),
            Levies: Levies(invoice),
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
                    flex: 1.5,
                    width: 200,
                    headerClassName: 'dataGridheader',
                },
                {
                    field: 'actions',
                    headerName: 'ACTIONS',
                    flex: 1.2,
                    width: 100,
                    sortable: false,
                    headerClassName: 'dataGridheader',
                    renderCell: (params) => (<>
                        <IconButton title='View Invoice' onClick={() => handleViewIconClick(params.row)}>
                            <VisibilityIcon fontSize='medium' color='primary' />
                        </IconButton>
                        <IconButton onClick={() => handleQuoteToInvoiceBtnClick(params.row)}>
                            {
                                loadQuote === params.row.InvoiceNumber ? <CircularProgress size={20} color='secondary' /> :
                                <SendRounded fontSize='small' color='secondary' title='Invoice Quotation' />
                            }
                        </IconButton>
                        <IconButton title='Print Invoice' onClick={() =>  pushPrintInvoiceData(params.row)}>
                            <PrintIcon fontSize='small' color='error' />
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
                field: 'actions',
                headerName: 'ACTIONS',
                flex: 1,
                width: 150,
                sortable: false,
                headerClassName: 'dataGridheader',
                renderCell: (params) => (<>
                    <IconButton title='View Invoice' onClick={() => handleViewIconClick(params.row)}>
                        <VisibilityIcon fontSize='medium' color='primary' />
                    </IconButton>
                    <IconButton onClick={() => handleQuoteToInvoiceBtnClick(params.row)}>
                        {
                            loadQuote === params.row.InvoiceNumber ? <CircularProgress size={20} color='secondary' /> :
                            <SendRounded fontSize='small' color='secondary' title='Invoice Quotation' />
                        }
                    </IconButton>
                    <IconButton title='Print Invoice' onClick={() =>  pushPrintInvoiceData(params.row)}>
                        <PrintIcon fontSize='small' color='error' />
                    </IconButton>
                </>),
            },
        ];
    }, [isSmallScreen]);

    // Delete quotation invoice
    const deleteQuote = async (invNum) => {
        try {
            const result = await deleteQuotation(invNum);
            if (result) {
                handleCloseDialog();
                setSubmitted(true);
            }
        }
        catch (error) {
            return error;
        }
    }

    // Open invoice view
    const handleViewIconClick = (row) => {
        setSelectedRow(row);
        setOpenDialog(true);
    };

    // Pump print data into selected invoice
    const pushPrintInvoiceData = (data) => {
        console.log("");
        setOpenPrintInvoice(true);
        setPrintInvoice(oldState => [...oldState, data]);
    }

    // print not VAT invoice
    const printNoVATInvoice = (data) => {
        if(data.length > 0){
            const updatedInvoice = data.map(item => ({
                ...item,
                showVAT: "no"
            }));
            handlePrintIcon(updatedInvoice);
        }
        setOpenPrintInvoice(false)
        return setPrintInvoice([]);
    }

    // Print invoice
    const handlePrintIcon = (row) => {
        setOpenPrintInvoice(false)
        const invoiceTemplateHTML = ReactDOMServer.renderToStaticMarkup(< InvoiceTemplate data={row} />);
        setPrintInvoice([]);
        const printWindow = window.open('', '_blank');
        printWindow.document.body.innerHTML = invoiceTemplateHTML;
        printWindow.onload = () => {
            printWindow.print();

            setTimeout(() => {
                printWindow.onafterprint = () => {
                    printWindow.close();
                };
            }, 1000);
        };
    }

    const handleQuoteToInvoiceBtnClick = (row) => {
        const payload = UseFullPayload(row);
        setHeader(payload);
        setOpenConfirm(true);
    }

    const sendPayload = async () => {
        try {
            setLoadQuote(header.InvoiceNumber || header.invoiceNumber);
            setOpenConfirm(false);

            const response  = await postNewGRAInvoice(header);
            if (response && response.status !== 'error') {
                setNotify((e) => ({ ...e, message: "Invoice submitted to GRA success!", color: 'success' }));
                fetchData();
            } else {
                setNotify((e) => ({ ...e, message: response.message || "Invoice submitted to GRA failed!", color: 'error' }));
            }
        }
        catch (error) {
            setNotify((e) => ({ ...e, message: error.message || "Invoice submitted to GRA failed!", color: 'error' }));
        }
        setOpen(true);
        setLoadQuote(null);
    }

    const closeConfirm = () => {
        setNotify((e) => ({ ...e, message: "Transaction cancelled!", color: 'error' }));
        setOpen(true);
        setOpenConfirm(false);
        setHeader([]);
    }


    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleClose = (event, reason) => { if (reason === 'clickaway') { return; } setOpen(false) };

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
                    <Typography color='white' variant='h3'>Quotatations</Typography> 
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
            {
                selectedRow && (
                    <>
                        < InvoiceDetails 
                            selectedRow={selectedRow} 
                            openDialog={openDialog} 
                            handleCloseDialog={handleCloseDialog} 
                            status={status} 
                            submitted={setSubmitted}
                            deleteQuote={deleteQuote}
                        />
                    </>
                )
            }
            {/* Confirm Proforma Invoice sent sent to GRA */}
            <Dialog open={openConfirm} sx={{ padding: '20px' }}>
                <DialogTitle color='darkred' variant='h3'>Confirm Submission</DialogTitle>
                <DialogContent>
                    <Typography variant='body1' align='center'>
                        You want to submit quotation to GRA?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeConfirm} variant='outlined' color='error'>Cancel</Button>
                    <Button onClick={sendPayload} variant='contained' color='primary'>Proceed</Button>
                </DialogActions>
            </Dialog>
            
            {/* Print Invoice in VAT or without VAT */}
            <Dialog open={openPrintInvoice} sx={{ padding: '20px' }}>
                <DialogTitle color='darkblue' variant='h3'>
                    Print VAT & Levies 
                    <IconButton color='error' size='medium' onClick={() => setOpenPrintInvoice(false)}>
                        <Close/>
                    </IconButton> 
                </DialogTitle>
                <DialogContent>
                    <Typography variant='body1' align='center'>
                        Do you want to show on the invoice?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => printNoVATInvoice(printInvoice)}  variant='contained' color='error'>No</Button>
                    <Button onClick={() => handlePrintIcon(printInvoice)} variant='contained' color='primary'>Yes</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
