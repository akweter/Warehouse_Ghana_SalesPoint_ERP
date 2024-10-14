import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import {
    IconButton,
    Grid,
    Typography,
} from '@mui/material';

import { GeneralCatchError } from '../../utilities/errorAlert';
import { fetchRefundInvoices } from '../../apiActions/allApiCalls/refund';
import InvoiceDetails from '../../views/invoices/invoiceDetails';

// /* eslint-disable */

export default function Refund() {
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openGeneralCatch, setOpenGeneralCatch] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 600);
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const invoicesData = await fetchRefundInvoices();
            const updatedInvoices = invoicesData.map((invoice, index) => ({
                ...invoice,
                id: index,
                InvoiceDate: formatDate(invoice.InvoiceDate),
                Quantity: Quantity(invoice.TotalAmount, invoice.products),
            }));
            setInvoices(updatedInvoices);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
        catch (error) {
            setInvoices([]);
            setAlert((e) => ({ ...e, message: `Something unexpected happened with\n your connection. \n\n Please log in again if it persist.`, color: 'error' }));
            setOpenGeneralCatch(true);
            setLoading(false);
        }
    };
    
    const Quantity = (totalAmount, products) => {
        if (totalAmount && products && products.length > 0) {
            const productPrice = parseFloat(products[0].ProductPrice);
            if (productPrice !== 0) {
                const quantity = Math.floor(parseFloat(totalAmount) / productPrice);
                return quantity > 0 ? quantity : 1;
            }
        }
        return null;
    }

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
                    headerName: 'View',
                    flex: 1,
                    width: 150,
                    sortable: false,
                    headerClassName: 'dataGridheader',
                    renderCell: (params) => (<>
                        <IconButton title='View Refund' onClick={() => handleViewIconClick(params.row)}>
                            <VisibilityIcon fontSize='medium' color='secondary' />
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
                headerClassName: 'dataGridheader',
                renderCell: (params) => {
                    return params.row.id + 1;
                },
                flex: 1,
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
                field: 'Reference',
                headerName: 'Reference #',
                description: 'Reference number',
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
                field: 'actions',
                headerName: 'View',
                flex: 1,
                width: 150,
                sortable: false,
                headerClassName: 'dataGridheader',
                renderCell: (params) => (<>
                    <IconButton title='View Refund' onClick={() => handleViewIconClick(params.row)}>
                        <VisibilityIcon fontSize='medium' color='secondary' />
                    </IconButton>
                </>),
            },
        ];
    }, [isSmallScreen]);

    const handleViewIconClick = (row) => {
        setSelectedRow(row);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => setOpenDialog(false);
    const getRowId = (row) => row.AutoID;

    return (
        <div>
            <Grid container sx={{ justifyContent: 'space-around', backgroundColor: 'darkblue', paddingTop: 1, paddingBottom: 1, }}>
                <Typography color='white' variant='h3'>Refund Transactions</Typography>
            </Grid>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={invoices}
                    columns={columns}
                    loading={loading ? loading : null}
                    getRowId={getRowId}
                    density='compact'
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
                {
                    alert.message ? <GeneralCatchError alert={alert} open={openGeneralCatch} /> : null
                }
                {
                    selectedRow && (<>< InvoiceDetails selectedRow={selectedRow} openDialog={openDialog} handleCloseDialog={handleCloseDialog} /></>)
                }
            </Box>
        </div>
    );
}
