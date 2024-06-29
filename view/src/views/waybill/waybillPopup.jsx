import React, { useState } from 'react';
import {
    Button,
    Dialog,
    Paper,
    Popover,
    Typography,
} from '@mui/material';
import { SmallTextField } from '../../views/customerSuppliers/verifyTIN';
import { FetchWaybillInvoice } from '../../apiActions/allApiCalls/invoice';
import WaybillForm from './waybillForm';

const WaybillPopper = () => {
    const [data, setData] = useState("");
    const [dialog, openDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [result, setResult] = useState("");
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const printWaybill = async () => {
        try {
            const result = await FetchWaybillInvoice(data);
            if (result) {
                setResult(result);
                openDialog(true);
            }
        }
        catch (error) {
            setResult([]);
        }
    }

    const handleDialog = () => openDialog(false);

    return (
        <>
            <Button variant="contained" color='error' onClick={handleClick}>
                <Typography color='white'>Print Waybill</Typography>                
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Typography sx={{ p: 2 }}>
                    <SmallTextField setData={setData} label={"Invoice #"} handleVerification={printWaybill} />
                </Typography>
            </Popover>
            <Dialog
                open={dialog}
                onClose={() => openDialog(false)}
                PaperProps={{
                    sx: {
                        width: '53%',
                        height: '100%',
                        maxWidth: '53%',
                        maxHeight: '100%',
                        margin: 0,
                    },
                }}
                fullWidth
                maxWidth="xl"
            >
                <Paper sx={{ height: '100%' }}>
                    <WaybillForm formData={result} closeDialog={handleDialog}/>
                </Paper>
            </Dialog>
        </>
    );
};

export default WaybillPopper;
