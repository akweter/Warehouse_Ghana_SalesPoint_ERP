import React, { useState, useEffect, useMemo } from 'react';
import { 
    Paper,
    Stack,
    Typography,
    Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import { fetchRefundCancelledInvoices } from '../../apiActions/allApiCalls/refund';

/* eslint-disable */
const DemoPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
}));

const DrawerContent = () => {
    const [show, setShow] = useState([]);
    const [data, setData] = useState([]);
    const [alert, setAlert]= useState({message: '', color: 'success'});

    useEffect(() => {
        fetchRefundCancelledInvoices()
            .then((result) => {
                    if (Array.isArray(result) && result.length > 0) {
                        setData(result);
                        setShow(new Array(result.length).fill(false));
                    } else {
                        setData([]);
                    }
                })
            .catch(() => {
                setTimeout(() => {
                    setAlert((e) => ({...e, message: `Something unexpected happened with\n your connection or server interrupted. \n\n Please log in again if it persists.`, color: 'error'}));
                }, 2000);
            });
    }, []);


    const columns = useMemo(() => {
        return [
            {
                field: 'Inv_user',
                headerName: 'Cancelled By',
                description: 'Cancelled By',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'Inv_Number',
                headerName: 'Invoice #',
                description: 'Invoice number',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'Inv_Reference',
                headerName: 'Reference #',
                description: 'Reference number',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'Inv_date',
                headerName: 'Date',
                description: 'Transaction Date',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            }
        ]
    });
    const getRowId = (row) => row.Inv_ID_auto;

    return (
        <Stack direction="row">
            <DemoPaper variant="outlined" sx={{ width: 750 }}>
                <Typography variant='h4' bgcolor='darkred' color="white" align='center' borderBottom={1}>Cancelled Refund Transactions</Typography>
                <Box sx={{ height: 600, width: '100%' }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        getRowId={getRowId}
                        density='compact'
                        disableRowSelectionOnClick={false}
                        hideFooterSelectedRowCount={true}
                        hideFooter={true}
                        filterMode='client'
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                            },
                        }}
                    />
                </Box>
            </DemoPaper>
        </Stack>
    );
};

export default DrawerContent;
