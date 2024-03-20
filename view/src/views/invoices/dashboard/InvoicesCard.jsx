import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { LoadingSpinner } from 'ui-component/loaderAPI';
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
                setLoading(false);
            }, 900);
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
                width: 100,
            },
            {
                field: 'InvoiceNumber',
                headerName: 'Invoice #',
                description: 'Invoice number',
                flex: 1,
                width: 100,
            },
            {
                field: 'CustomerName',
                headerName: 'Customer',
                description: 'Customer Name',
                flex: 1,
                width: 150,
            },
            {
                field: 'TotalAmount',
                headerName: 'Total Amt',
                description: 'Total Invoice Amount',
                flex: 1,
                width: 50,
            },
            {
                field: 'Levies',
                headerName: 'Levies',
                description: 'Total Invoice Levies',
                flex: 1,
                width: 40,
            },
            {
                field: 'VatAmount',
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
                            <>
                                < InvoiceDetails selectedRow={selectedRow} openDialog={openDialog} handleCloseDialog={handleCloseDialog} />
                            </>
                        )}
                    </Box>
            }
        </div>
    );
}
