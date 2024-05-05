import React, { useState } from 'react';
import { 
    Button,
    Dialog,
    Popover,
    Typography,
} from '@mui/material';
import { SmallTextField } from 'views/invoices/verifyTIN';
import { FetchWaybillInvoice } from 'apiActions/allApiCalls/invoice';
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
            console.error(error);
        }
    }

    return (
        <div>
            <Button variant="outlined" onClick={handleClick}>Print Waybill</Button>
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
                <Typography sx={{ p: 2 }}><SmallTextField setData={setData} label={"Invoice #"} handleVerification={printWaybill} /></Typography>
            </Popover>
            <Dialog open={dialog} onClose={()=> openDialog(false)}>
                <WaybillForm formData={result}/>
            </Dialog>
        </div>
    );
};

export default WaybillPopper;
