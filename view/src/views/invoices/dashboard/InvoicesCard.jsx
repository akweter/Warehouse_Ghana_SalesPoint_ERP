import { useEffect, useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { GeneralCatchError } from 'utilities/errorAlert';
import { fetchAllInvoices } from 'apiActions/allApiCalls/invoice';
import InvoiceDetails from '../invoiceDetails';

/* eslint-disable */

export default function DashBoardInvoice() {
    const [loading, setLoading] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [alert, setAlert] = useState({ message: '', color: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const invoicesData = await fetchAllInvoices();
            setTimeout(() => {
                setInvoices(invoicesData);
                const ten = invoicesData.slice(0, 10);
                setInvoices(ten);
            }, 1000);
        }
        catch (error) {
            setInvoices([]);
            setOpen(true);
            setAlert((e) => ({ ...e, message: `Something unexpected happened with\n your connection. \n\n Please log in again if it persist.`, color: 'error' }));
            setLoading(false);
        }
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
            id: index + 1,
            ...invoice,
            Inv_date: formatDate(invoice.Inv_date),
            Levies: Levies(invoice),
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
                field: 'IssuerName',
                headerName: 'User Name',
                description: 'Served By',
                flex: 1,
                width: 70,
            },
            {
                field: 'InvoiceNumber',
                headerName: 'Invoice #',
                description: 'Invoice number',
                flex: 1,
                width: 70,
            },
            {
                field: 'CustomerName',
                headerName: 'Customer',
                description: 'Customer Name',
                flex: 1,
                width: 100,
            },
            {
                field: 'TotalAmount',
                headerName: 'Total Amt',
                description: 'Total Invoice Amount',
                flex: 1,
                width: 70,
            },
            {
                field: 'Levies',
                headerName: 'Levies',
                description: 'Total Invoice Levies',
                flex: 1,
                width: 90,
            },
            {
                field: 'VatAmount',
                headerName: 'VAT',
                description: 'Total Invoice VAT',
                flex: 1,
                width: 90,
            },
            {
                field: 'actions',
                headerName: 'View',
                // flex: 1,
                width: 10,
                sortable: false,
                renderCell: (params) => (<>
                    <IconButton title='View Invoice' onClick={() => handleViewIconClick(params.row)}>
                        <VisibilityIcon fontSize='small' color='info' />
                    </IconButton>
                </>),
            },
        ]
    });

    const handleViewIconClick = (row) => {
        setSelectedRow(row);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {  setOpenDialog(false) };

    return (
        <>
            {
                alert.message ?
                    <GeneralCatchError alert={alert} handleClose={handleCloseDialog} open={openDialog} /> :
                    null
            }
            <DataGrid
                rows={rowsWithIds}
                columns={columns}
                sx={{height: 300, minWidth: '100%'}}
                density='compact'
                loading={loading}
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
                <>
                    < InvoiceDetails selectedRow={selectedRow} openDialog={openDialog} handleCloseDialog={handleCloseDialog} />
                </>
            )}
        </>
    );
}
