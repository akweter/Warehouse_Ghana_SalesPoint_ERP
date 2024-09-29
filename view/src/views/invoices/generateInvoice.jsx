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
    Chip,
    Container} from '@mui/material';
import Slide from '@mui/material/Slide';

// /* eslint-disable */
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const MakeNewInvoice = ({ setSubmitted, status }) => {
    const [drop, setDrop] = useState(false);
    const [open, setOpen] = useState(false);
    const [callback, setCallback] = useState(false);

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
                <Typography variant='h5' color='darkred'>Issue New Invoice</Typography>
            </Button>
            <Dialog
                fullWidth
                maxWidth="xl"
                open={open}
                TransitionComponent={Transition}
                transitionDuration={1000}
            >
                <AppBar position="static" sx={{ backgroundColor: '#151B4D' }}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters sx={{ flexWrap: 'wrap' }}>
                            <img src={logo} width={60} height={40} alt='Logo' />
                            <Typography
                                variant="h2"
                                sx={{
                                    flex: 1,
                                    textAlign: { xs: 'center', sm: 'left' },
                                    color: 'white',
                                    fontSize: { xs: '1rem', sm: '1.5rem' }
                                }}
                            >
                                Make New Invoice
                            </Typography>
                            <Box paddingRight={3} sx={{ width: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'center', sm: 'right' } }}>
                                <Button variant="contained" color='warning' onClick={() => setCallback(true)}>
                                    <Typography>Request CallBack</Typography>
                                </Button>
                            </Box>
                            <Stack 
                                direction="row" 
                                spacing={1} sx={{ 
                                    width: { xs: '100%', sm: 'auto' }, 
                                    justifyContent: { xs: 'center', sm: 'flex-end' }, 
                                    mt: { xs: 2, sm: 0 } 
                                }}
                            >
                                <Chip
                                    variant="filled" 
                                    color={status ? 'primary' : 'error'}
                                    label={status ? 'GRA UP' : 'GRA DOWN'}
                                />
                                <Button onClick={handleClose} fullWidth={false} color='error' variant="contained" size='small' startIcon={<CancelSharpIcon />}>
                                    Cancel
                                </Button>
                            </Stack>
                        </Toolbar>
                    </Container>
                </AppBar>
                <div style={{ marginTop: '10px' }}>
                    < InvoiceForm 
                        setSubmitted={setSubmitted} 
                        setDrop={setDrop} drop={drop} 
                        BackdropOpen={setOpen} 
                        callBack={callback}
                        setCallBack={setCallback}
                    />
                </div>
            </Dialog>
            <Box></Box>
        </div>
    );
}

export default MakeNewInvoice;
