import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
    CurrencyExchangeSharp,
    Print as PrintIcon, 
    SendRounded,
    Visibility as VisibilityIcon 
} from '@mui/icons-material';
import { IconButton, Grid, Box, CircularProgress } from '@mui/material';

// projects
import { 
    checkGRAServerStatus, 
    fetchAllInvoices, 
    postNewInvoice,
} from 'apiActions/allApiCalls/invoice';
import MakeNewInvoice from './generateInvoice';
import RefundForms from 'views/refund/refundForm';
import InvoiceDetails from './invoiceDetails';
import InvoiceTemplate from './invoiceTemplate';
import { AlertError, GeneralCatchError } from 'utilities/errorAlert';
import { useFullPayload } from './invoiceQuotePayload';

/* eslint-disable */

const Invoice = () => {
    const [submitted, setSubmitted] = useState(false);
    const [status, setStatus] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadQuote, setLoadQuote] = useState(false);
    const [openRefDialog, setOpenRefDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [refundInv, setRefundInv] = useState([]);
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
            const res = await checkGRAServerStatus();
            setStatus(true);
        }
        catch (error) {
            console.log('response',error);
            setStatus(false); }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const Levies = (invoice) => {
        const { NHIL, GETFund, COVID, CST, Tourism } = invoice;
        const totalLevies = NHIL + GETFund + COVID + CST + Tourism;
        return parseFloat(totalLevies);
    };

    const rowsWithIds = useMemo(() =>
        invoices.map((invoice, index) => ({
            id: index,
            ...invoice,
            InvoiceDate: formatDate(invoice.InvoiceDate),
            Levies: Levies(invoice),
        })),
        [invoices]
    );

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
                field: 'Tourism',
                headerName: 'Tourism',
                description: 'Total Tourism Tax',
                flex: 1,
                width: 40,
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
                    <IconButton title='Print Invoice' onClick={() => handlePrintIcon(params.row)}>
                        <PrintIcon fontSize='small' color='error' />
                    </IconButton>
                    {
                        params.row.InvoiceStatus === "Invoice" ?
                        <IconButton title='Refund Invoice' onClick={() => handleRefundBtnClick(params.row)}>
                            <CurrencyExchangeSharp fontSize='small' color='secondary' />
                        </IconButton> :
                        <IconButton title='Refund Invoice' onClick={() => handleQuoteToInvoiceBtnClick(params.row)}>
                            { loadQuote === true ? <CircularProgress size={20} color='secondary'/> : <SendRounded fontSize='small' color='secondary' />  }
                        </IconButton>
                    }
                </>),
            },
        ]
    });

    const handleViewIconClick = (row) => {
        setSelectedRow(row);
        setOpenDialog(true);
    };

    const handlePrintIcon = (row) => {
        const invoiceTemplateHTML = renderInvoiceTemplate(row);

        const printWindow = window.open('', '_blank');
        printWindow.document.body.innerHTML = invoiceTemplateHTML;
        printWindow.onload = () => {
            printWindow.print();
            printWindow.onafterprint = () => {
                printWindow.close();
            };
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
        const payload = useFullPayload(row);
        if (window.confirm('Do you want to invoice it?')) {
            try {
                await new Promise((resolve) => {
                    setNotify((e) => ({ ...e, message: '', color: '' }));
                    setLoadQuote(true);
                    setTimeout(resolve, 2000);
                });
                await postNewInvoice(payload);
                setNotify((e) => ({...e, message: "Invoice submitted to GRA success!", color: 'success'}));
                setOpen(true);

                setTimeout(() => {
                    setLoading(true);
                    setSubmitted(true);
                    setStatus(true);
                }, 1000);
            }
            catch (error) {
                setNotify((e) => ({...e, message: "Invoice submitted to GRA failed!", color: 'error'}));
                setOpen(true);
            }
        }
        else {
            setNotify((e) => ({...e, message: "Transaction cancelled!", color: 'error'}));
            setOpen(true);
        }        
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
            <Grid container sx={{ justifyContent: 'space-around' }}>
                < MakeNewInvoice setSubmitted={setSubmitted} status={status}/>
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
            { alert.message ? <GeneralCatchError alert={alert} handleClose={handleClose} open={open} /> : null }
            { notify.message ? <AlertError alert={notify} handleClose={handleClose} open={open} /> : null }
            {
                selectedRow && (
                    <>< InvoiceDetails selectedRow={selectedRow} openDialog={openDialog} handleCloseDialog={handleCloseDialog} /></>
                )
            }
            <RefundForms
                open={openRefDialog}
                handleClose={handleCloseRefDialog}
                refundInv={refundInv ? refundInv : null}
                key={refundInv ? refundInv : null}
                setSubmitted={setSubmitted}
            />
        </div>
    );
}
export default Invoice;
