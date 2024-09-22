import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableBody,
    Paper,
    Typography,
    Box,
    AppBar,
    Toolbar,
    Stack,
    Chip,
    Slide,
} from '@mui/material';
import { CancelSharp } from '@mui/icons-material';
import logo from '../../assets/images/logo.webp';
import InvoiceForm from './invoiceForm';
import RefundForms from '../refund/refundForm';

const InvoiceDetails = ({ selectedRow, openDialog, handleCloseDialog, status, submitted, deleteQuote }) => {
    const [drop, setDrop] = useState(false);
    const [open, setOpen] = useState(false);
    const [openRefDialog, setOpenRefDialog] = useState(false);

    const handleOpen = () => { setOpen(true); handleCloseDialog() }
    const handleClose = () => { setOpen(false); }

    const closeRefundDialog = () => setOpenRefDialog(false);

    const handleRefundBtnClick = () => {
        setOpenRefDialog(true);
        handleCloseDialog();
    }

    return (
        <Box>
            <Dialog open={openDialog} maxWidth='lg'>
                <DialogContent>
                    <Typography sx={{ fontSize: '22px', textAlign: "center", fontWeight: '600', fontStyle: 'italic' }}>Invoice Details</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ borderCollapse: 'collapse' }} size='small' width='100%'>
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th" scope="row">Invoice #:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.InvoiceNumber || 'Unavailable'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Served By:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.IssuerName || 'Unavailable'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Customer Name:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.CustomerName || 'Unavailable'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Customer TIN:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.CustomerTIN || 'Unavailable'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Transaction Type:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.CalculationType || 'Unavailable'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Transaction Date:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.InvoiceDate || 'Unavailable'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Invoice Type:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.InvoiceStatus || 'Unavailable'}</TableCell>
                                </TableRow>
                                {
                                    selectedRow.DeliveryFee ? (
                                        <TableRow>
                                            <TableCell component="th" scope="row">Delivery</TableCell>
                                            <TableCell component="td" scope="row">{selectedRow.DeliveryFee || 0}</TableCell>
                                        </TableRow>
                                    ) : null
                                }
                                <TableRow>
                                    <TableCell component="th" scope="row">Discount:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.currency} {selectedRow.InvoiceDiscount || 0}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Total VAT:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.currency} {selectedRow.VatAmount || 0}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Total Levies:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.currency} {(selectedRow.Levies || 0)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Total Amount:</TableCell>
                                    <TableCell component="td" scope="row">
                                        {selectedRow.currency}
                                        {
                                            selectedRow.CalculationType === "EXCLUSIVE" ?
                                            selectedRow.Currency+":"+ ((
                                                Number(selectedRow.TotalAmount) + 
                                                Number(selectedRow.VatAmount) + 
                                                Number(selectedRow.CST) + 
                                                Number(selectedRow.Tourism) + 
                                                Number(selectedRow.GETFund) + 
                                                Number(selectedRow.NHIL)
                                            ) - selectedRow.InvoiceDiscount).toFixed(2) :
                                            selectedRow.Currency+": "+ (
                                                Number(selectedRow.TotalAmount - selectedRow.InvoiceDiscount)
                                            ).toFixed(2)
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                    </TableContainer>

                    {/* Products table... */}
                    {Array.isArray(selectedRow.products) && selectedRow.products.length > 0 ? (
                        <TableContainer component={Paper} sx={{ marginTop: '10px' }}>
                            <Table sx={{ minWidth: 500, borderCollapse: 'collapse' }} size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell variant='footer'>#</TableCell>
                                        <TableCell variant='footer'>Product</TableCell>
                                        <TableCell variant='footer'>Price</TableCell>
                                        <TableCell variant='footer'>Qty</TableCell>
                                        <TableCell variant='footer'>Discount</TableCell>
                                        <TableCell variant='footer'>Refunded</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedRow.products.map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{product.ProductName || 'Unavailable'}</TableCell>
                                            <TableCell>{product.ProductPrice || 0}</TableCell>
                                            <TableCell>{selectedRow.Quantity || product.Quantity || 0}</TableCell>
                                            <TableCell>{product.ProductDiscount || 0}</TableCell>
                                            <TableCell>{product.RefundedQuantity || 0}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <p>Products not available</p>
                    )}
                </DialogContent>
                <DialogActions>
                    {
                        selectedRow.InvoiceStatus === "Proforma Invoice" ? (<>
                            <Button variant='contained' color='error' size='small' onClick={() => deleteQuote(selectedRow.InvoiceNumber)}>Delete</Button>
                            <Button variant='contained' color='secondary' size='small' onClick={handleOpen}>Edit Quote</Button>
                            <Button variant='contained' color='warning' size='small' onClick={handleCloseDialog}>Close</Button>
                        </>) : (<>                        
                            <Button variant='contained' color='secondary' size='medium' onClick={() => handleRefundBtnClick()}>Refund Invoice</Button>
                            <Button variant='contained' color='error' size='medium' onClick={handleCloseDialog}>Close</Button>
                        </>)
                    }
                </DialogActions>
            </Dialog>
            <Dialog
                fullWidth
                maxWidth="xl"
                open={open}
                TransitionComponent={Slide}
                transitionDuration={1000}
            >
                <AppBar style={{ backgroundColor: '#151B4D' }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <img src={logo} width={60} height={40} alt='Logo' />
                        <Typography
                            variant="h2"
                            sx={{
                                flex: 1,
                                textAlign: 'center',
                                color: 'white'
                            }}
                        >
                            Update The Quotation
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Chip
                                variant="filled" 
                                color={status === true ? 'primary' : 'error'}
                                label={status === true ? 'GRA UP' : 'GRA DOWN'}
                            />
                        </Stack>
                        <Box>
                            <Button onClick={handleClose} fullWidth color='error' variant="contained" size='small' startIcon={<CancelSharp />}>
                                Cancel
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                <div style={{ marginTop: '10px' }}>
                    < InvoiceForm setDrop={setDrop} drop={drop} BackdropOpen={setOpen} quoteProducts={selectedRow} setSubmitted={submitted} />
                </div>
            </Dialog>
            <Dialog
                fullWidth
                maxWidth="md"
                open={openRefDialog}
            >
                <RefundForms
                    handleClose={closeRefundDialog}
                    refundInv={selectedRow}
                    setSubmitted={submitted}
                />
            </Dialog>
        </Box>
    );
}

export default InvoiceDetails;
