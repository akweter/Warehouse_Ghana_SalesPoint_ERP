import React, { useState } from 'react';
import logo from '../../assets/images/logo.webp';
import InvoiceForm from './invoiceForm';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import {
    Button,
    Dialog,
    AppBar,
    Toolbar,
    Typography,
    Box,
    Stack,
    Chip} from '@mui/material';
import Slide from '@mui/material/Slide';
import { CheckCircle } from '@mui/icons-material';

// /* eslint-disable */
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const MakeNewInvoice = ({ setSubmitted, status }) => {
    const [drop, setDrop] = useState(false);
    const [open, setOpen] = useState(false);

    const handleOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    return (
        <div>
            <Button
                variant='contained'
                color='primary'
                size='medium'
                sx={{ color: 'gold' }}
                onClick={handleOpen}
            >
                Issue New Invoice
            </Button>
            <Dialog
                fullWidth
                maxWidth="xl"
                open={open}
                TransitionComponent={Transition}
                transitionDuration={1000}
            >
                <AppBar style={{ backgroundColor: '#151B4D' }}>
                    <Toolbar sx={{
                        justifyContent: 'space-between',
                    }}>
                        <img src={logo} width={60} height={40} alt='Logo' />
                        <Typography
                            variant="h2"
                            sx={{
                                flex: 1,
                                textAlign: 'center',
                                color: 'white'
                            }}
                        >
                            Make New Invoice
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Chip 
                                variant="filled" 
                                color={status === true ? 'primary' : 'error'} 
                                icon={status === true ? <CheckCircle /> : <CancelSharpIcon />}
                                label={status === true ? 'GRA UP' : 'GRA DOWN'}
                            />
                        </Stack>
                        <Box>
                            <Button onClick={handleClose} fullWidth color='error' variant="contained" size='small' startIcon={<CancelSharpIcon />}>
                                Cancel
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                <div style={{ marginTop: '10px' }}>
                    < InvoiceForm setSubmitted={setSubmitted} setDrop={setDrop} drop={drop} BackdropOpen={setOpen} />
                </div>
            </Dialog>
        </div>
    );
}

export default MakeNewInvoice;
