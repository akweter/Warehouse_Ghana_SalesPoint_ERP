import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
    Close,
    CurrencyExchangeSharp,
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
} from '@mui/material';

// projects
import {
    checkGRAServerStatus,
    deleteQuotation,
    fetchAllInvoices,
    postNewGRAInvoice,
} from '../../apiActions/allApiCalls/invoice';
import MakeNewInvoice from './generateInvoice';
import RefundForms from '../../views/refund/refundForm';
import InvoiceDetails from './invoiceDetails';
import InvoiceTemplate from './invoiceTemplate';
import { AlertError, GeneralCatchError } from '../../utilities/errorAlert';
import { UseFullPayload } from './invoiceQuotePayload';
import WaybillPopper from '../../views/waybill/waybillPopup';
import ProductPlaceholder from '../../ui-component/cards/Skeleton/ProductPlaceholder';

// /* eslint-disable */
const Invoice = () => {
    const [submitted, setSubmitted] = useState(false);
    const [status, setStatus] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadQuote, setLoadQuote] = useState(false);
    const [openRefDialog, setOpenRefDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openPrintInvoice, setOpenPrintInvoice] = useState(false);
    const [printInvoice, setPrintInvoice] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [refundInv, setRefundInv] = useState([]);
    const [header, setHeader] = useState([]);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [notify, setNotify] = useState({ message: '', color: '' });

    useEffect(() => {
        fetchData();
        testServer();
    }, [submitted, status]);

    // Fetch Invoices data from Database
    const fetchData = async () => {
        try {
            setLoading(true);
            const invoicesData = await fetchAllInvoices();
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

    // Format Date and Time to GRA Standard
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Sum Levied together
    const Levies = (invoice) => {
        const { NHIL, GETFund, COVID, CST, Tourism } = invoice;
        const totalLevies = NHIL + GETFund + COVID + CST + Tourism;
        return parseFloat(totalLevies);
    };

    // Set Row for DataGrid
    const rowsWithIds = useMemo(() =>
        invoices.map((invoice, index) => ({
            id: index,
            ...invoice,
            InvoiceDate: formatDate(invoice.InvoiceDate),
            Levies: Levies(invoice),
        })),
        [invoices]
    );

    // Set column for DataGrid
    const columns = useMemo(() => {
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
                field: 'InvoiceStatus',
                headerName: 'Transaction',
                description: 'Transaction Type',
                flex: 1,
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
                field: 'CustomerName',
                headerName: 'Customer',
                description: 'Customer Name',
                flex: 1,
                width: 200,
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
                field: 'Levies',
                headerName: 'Levies',
                description: 'Total Invoice Levies',
                flex: 1,
                width: 40,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'VatAmount',
                headerName: 'VAT',
                description: 'Total Invoice VAT',
                flex: 1,
                width: 80,
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
                    {
                        params.row.InvoiceStatus === "Invoice" ?
                            <IconButton title='Refund Invoice' onClick={() => handleRefundBtnClick(params.row)}>
                                <CurrencyExchangeSharp fontSize='small' color='secondary' />
                            </IconButton>
                        :
                            <IconButton onClick={() => handleQuoteToInvoiceBtnClick(params.row)}>
                                {loadQuote === true ?
                                    <CircularProgress size={20} color='secondary' /> :
                                    <SendRounded fontSize='small' color='secondary' title='Invoice Quotation' />}
                            </IconButton>
                    }
                    <IconButton title='Print Invoice' onClick={() =>  pushPrintInvoiceData(params.row)}>
                        <PrintIcon fontSize='small' color='error' />
                    </IconButton>
                </>),
            },
        ]
    });

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
        return null;
    }

    // Print invoice
    const handlePrintIcon = (row) => {
        setOpenPrintInvoice(false)
        const invoiceTemplateHTML = renderInvoiceTemplate(row);

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

    const renderInvoiceTemplate = (row) => {
        const invoiceTemplate = ReactDOMServer.renderToStaticMarkup(< InvoiceTemplate data={row} />);
        return invoiceTemplate;
    };

    const handleRefundBtnClick = (row) => {
        setRefundInv(row);
        setOpenRefDialog(true);
    }

    const handleQuoteToInvoiceBtnClick = async (row) => {
        const payload = UseFullPayload(row);
        setHeader(payload);
        setOpenConfirm(true);
    }

    const sendPayload = async () => {
        try {
            await new Promise((resolve) => {
                setNotify((e) => ({ ...e, message: '', color: '' }));
                setLoadQuote(true);
                setOpenConfirm(false);
                setTimeout(resolve, 2000);
            });
            await postNewGRAInvoice(header);
            setNotify((e) => ({ ...e, message: "Invoice submitted to GRA success!", color: 'success' }));
            setOpen(true);
            setLoadQuote(false);
            fetchData();
        }
        catch (error) {
            setNotify((e) => ({ ...e, message: "Invoice submitted to GRA failed!", color: 'error' }));
            setOpen(true);
            setLoadQuote(false);
        }
    }

    const closeConfirm = () => {
        setNotify((e) => ({ ...e, message: "Transaction cancelled!", color: 'error' }));
        setOpen(true);
        setOpenConfirm(false);
        setHeader([]);
    }

    const handleCloseRefDialog = () => {
        // setRefundInv(null);
        setOpenRefDialog(false);
    };

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
                    <Typography color='white' variant='h3'>Invoices Transactions</Typography> 
                </Grid>
                <Grid item>
                    < MakeNewInvoice setSubmitted={setSubmitted} status={status} />
                </Grid>
                <Grid item>
                    <WaybillPopper />
                </Grid>
                {/* <Grid item>
                </Grid> */}
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
            <RefundForms
                open={openRefDialog}
                handleClose={handleCloseRefDialog}
                refundInv={refundInv}
                setSubmitted={setSubmitted}
            />
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

export default Invoice;
