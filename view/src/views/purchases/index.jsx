/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import { Box, IconButton, Grid, Typography } from "@mui/material";
import { GeneralCatchError } from '../../utilities/errorAlert';
import { fetchAllPurchases } from '../../apiActions/allApiCalls/purchase';
import InvoiceDetails from '../invoices/invoiceDetails';


export default function Purchases(){
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openGeneralCatch, setOpenGeneralCatch] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        setLoading(true);
        try {
            const data = await fetchAllPurchases();
            setPurchases(data);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
        catch (error) {
            setAlert((e) => ({ ...e, message: `Something unexpected happened with\n your connection. \n\n Please log in again if it persist.`, color: 'error' }));
            setOpenGeneralCatch(true);
        }
        setLoading(false);
    }
    
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
        purchases.length > 0 && purchases.map((invoice, index) => ({
            id: index,
            ...invoice,
            InvoiceDate: formatDate(invoice.InvoiceDate),
            Levies: Levies(invoice),
        })),
        [purchases]
    );

    // Set column for DataGrid
    const columns = useMemo(() => {
        if (isSmallScreen) {
            return [
                {
                    field: 'CustomerName',
                    headerName: 'Customer',
                    flex: 1.5,
                    width: 200,
                    headerClassName: 'dataGridheader',
                },
                {
                    field: 'actions',
                    headerName: 'ACTIONS',
                    flex: 1,
                    width: 100,
                    sortable: false,
                    headerClassName: 'dataGridheader',
                    renderCell: (params) => (
                        <>
                            <IconButton title='View Invoice' onClick={() => handleViewIconClick(params.row)}>
                                <VisibilityIcon fontSize='medium' color='primary' />
                            </IconButton>
                        </>
                    ),
                },
            ];
        }
        return [
            {
                field: 'id',
                headerName: '#',
                width: 10,
                renderCell: (params) => params.row.id + 1,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'IssuerName',
                headerName: 'Issuer',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'InvoiceNumber',
                headerName: 'Invoice #',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'InvoiceDate',
                headerName: 'Date',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'CustomerName',
                headerName: 'Customer',
                flex: 1,
                width: 200,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'TotalAmount',
                headerName: 'Total Amt',
                flex: 1,
                width: 50,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'Levies',
                headerName: 'Levies',
                flex: 1,
                width: 40,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'VatAmount',
                headerName: 'VAT',
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
                renderCell: (params) => (
                    <>
                        <IconButton title='View Invoice' onClick={() => handleViewIconClick(params.row)}>
                                <VisibilityIcon fontSize='medium' color='primary' />
                            </IconButton>
                    </>
                ),
            },
        ];
    }, [isSmallScreen]);
    

    const handleViewIconClick = (row) => {
        setSelectedRow(row.logMessage);
        setOpenDialog(true);
    };

    const hancleCloseDialog = () => {setOpenDialog(false)}

    return(
        <>
            {
                alert.message ? <GeneralCatchError alert={alert} open={openGeneralCatch} /> : null
            }
            <Grid container sx={{ justifyContent: 'space-around', backgroundColor: 'darkblue', paddingTop: 1, paddingBottom: 1, }}>
                <Typography color='white' variant='h3'>Purchase History</Typography>
            </Grid>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rowsWithIds}
                    columns={columns}
                    loading={loading}
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
                selectedRow && (
                    <>
                        < InvoiceDetails
                            selectedRow={selectedRow} 
                            openDialog={openDialog} 
                            handleCloseDialog={hancleCloseDialog}
                        />
                    </>
                )
            }
        </>
    );
}
