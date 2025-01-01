import React, { useState } from 'react';

import InvoiceForm from './invoiceForm';
import {
    Button,
    Dialog,
    Typography,
    Box
} from '@mui/material';
import Slide from '@mui/material/Slide';

// /* eslint-disable */
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const MakeNewInvoice = ({ setSubmitted, btnMsg, type }) => {
    const [drop, setDrop] = useState(false);
    const [open, setOpen] = useState(false);
    

    const handleOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    return (
        <div>
            <Button
                variant='contained'
                color='inherit'
                size='large'
                onClick={handleOpen}
            >
                <Typography variant='h5' color='darkred'>{btnMsg}</Typography>
            </Button>
            <Dialog
                fullWidth
                maxWidth="xl"
                open={open}
                TransitionComponent={Transition}
                transitionDuration={800}
            >
                < InvoiceForm 
                    setSubmitted={setSubmitted} 
                    setDrop={setDrop} drop={drop} 
                    BackdropOpen={setOpen}
                    handleCloseDialog={handleClose}
                    appBarMsg={type && type === 'invoice' ? 'Make Quotation' : 'Create New Invoice'}
                    type={type}
                />
                
            </Dialog>
            <Box></Box>
        </div>
    );
}

export default MakeNewInvoice;
