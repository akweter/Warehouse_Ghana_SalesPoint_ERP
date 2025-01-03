/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { CopyAllOutlined, Print as PrintIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Box, IconButton, Grid, Typography, Snackbar, Dialog, Slide, DialogTitle, DialogContent, } from "@mui/material";
import { fetchAllUserActions } from '../../apiActions/allApiCalls/userActions';
import { GeneralCatchError } from '../../utilities/errorAlert';
import { writeText } from 'clipboard-polyfill';

export default function SystemLogs(){
    const [openDialog, setOpenDialog] = useState(false);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openGeneralCatch, setOpenGeneralCatch] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

    const [allActions, setAllActions] = useState([]);

    useEffect(() => {
        fetchDatas();
    }, []);

    const fetchDatas = async () => {
        setLoading(true);
        try {
            const data = await fetchAllUserActions();
            setAllActions(data);
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

    const columns = useMemo(() => {
        if (isSmallScreen) {
            return [
                {
                    field: 'logMessage',
                    headerName: 'Message',
                    description: 'Log message',
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
                        <IconButton title='View details' onClick={() => handleViewIconClick(params.row)}>
                            <VisibilityIcon fontSize='medium' color='secondary' />
                        </IconButton>
                        <IconButton title='Copy log' onClick={() =>  handleCopy(params.row)}>
                            <PrintIcon fontSize='small' color='inherit' />
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
                renderCell: (params) => params.row.id + 1,
            },
            {
                field: 'logType',
                headerName: 'Log Type',
                description: 'Log Time',
                flex: 0.3,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'logTime',
                headerName: 'Time',
                description: 'Log Time',
                flex: 0.7,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'logMessage',
                headerName: 'Message',
                description: 'Log message',
                flex: 2,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'userName',
                headerName: 'User',
                description: 'User Performing action',
                flex: 0.3,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'actions',
                headerName: 'Action',
                flex: 0.4,
                sortable: false,
                headerClassName: 'dataGridheader',
                renderCell: (params) => (<>
                    <IconButton title='View Refund' onClick={() => handleViewIconClick(params.row)}>
                        <VisibilityIcon fontSize='medium' color='secondary' />
                    </IconButton>
                    <IconButton title='Print Invoice' onClick={() =>  handleCopy(params.row)}>
                        <CopyAllOutlined fontSize='small' color='inherit' />
                    </IconButton>
                </>),
            },
        ];
    }, [isSmallScreen]);

    const rowsWithIds = useMemo(() =>
        allActions.length > 0 && allActions.map((logs, index) => ({
            id: index,
            ...logs,
        })),
        [allActions]
    );

    const handleCopy = (row) => {
        const copyLog = JSON.stringify(row, null, 2);
        writeText(copyLog)
            .then(() => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 3000);
            })
            .catch((error) => { alert('Failed to copy!') });
    }

    const handleViewIconClick = (row) => {
        setSelectedRow(row.logMessage);
        setOpenDialog(true);
    };

    const hancleCloseDialog = () => setOpenDialog(false);

    return(
        <>
            {
                alert.message ? <GeneralCatchError alert={alert} open={openGeneralCatch} /> : null
            }
            <Snackbar
                open={copied}
                message="Copied to clipboard!"
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                color='#1B50CB'
            />
            <Grid container sx={{ justifyContent: 'space-around', backgroundColor: 'darkblue', paddingTop: 1, paddingBottom: 1, }}>
                <Typography color='white' variant='h3'>System Logs</Typography>
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

            {/* <Dialog 
                open={openDialog}
                transitionDuration={Slide}
            >
                <DialogTitle sx={{ backgroundColor: 'darkblue', display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <Typography variant='h2' color='white'>Detailed Logs</Typography>
                    <IconButton onClick={hancleCloseDialog} color='error'>
                        <Typography fontSize='1em' color='red'>Close</Typography>
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ padding: 2 }}>
                    <Typography variant='body1' color='darkgrey' fontSize={20}>{JSON.stringify(selectedRow, null, 2)}</Typography>
                </DialogContent>
            </Dialog> */}
        </>
    );
}
