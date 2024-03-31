import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { CurrencyExchangeSharp, Print as PrintIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { IconButton, Grid, Box } from '@mui/material';

// projects
import { GeneralCatchError } from 'utilities/errorAlert';
import { checkGRAServerStatus, fetchAllInvoices } from 'apiActions/allApiCalls/invoice';
import MakeNewInvoice from './generateInvoice';
import RefundForms from 'views/refund/refundForm';
import InvoiceDetails from './invoiceDetails';
import InvoiceTemplate from './invoiceTemplate';

/* eslint-disable */

export default function Invoice() {
    const [submitted, setSubmitted] = useState(false);
    const [status, setStatus] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openRefDialog, setOpenRefDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [refundInv, setRefundInv] = useState([]);
    const [alert, setAlert] = useState({ message: '', color: '' });

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
            setOpen(true);
            setAlert((e) => ({ ...e, message: `Something unexpected happened with\n your connection. \n\n Please log in again if it persist.`, color: 'error' }));
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
                renderCell: (params) => (<>
                    <IconButton title='View Invoice' onClick={() => handleViewIconClick(params.row)}>
                        <VisibilityIcon fontSize='medium' color='primary' />
                    </IconButton>
                    <IconButton title='Print Invoice' onClick={() => handlePrintIcon(params.row)}>
                        <PrintIcon fontSize='small' color='error' />
                    </IconButton>
                    <IconButton title='Refund Invoice' onClick={() => handleRefundBtnClick(params.row)}>
                        <CurrencyExchangeSharp fontSize='small' color='secondary' />
                    </IconButton>
                </>),
                headerClassName: 'dataGridheader',
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
            {
                alert.message ?
                    <GeneralCatchError alert={alert} handleClose={handleClose} open={open} /> :
                    null
            }
            {
                selectedRow && (
                    <>
                        < InvoiceDetails selectedRow={selectedRow} openDialog={openDialog} handleCloseDialog={handleCloseDialog} />
                    </>
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
