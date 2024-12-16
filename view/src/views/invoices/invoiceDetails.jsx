// /* eslint-disable */
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
    Slide,
    DialogTitle,
    IconButton,
} from '@mui/material';
import InvoiceForm from './invoiceForm';
import RefundForms from '../refund/refundForm';

const InvoiceDetails = ({ selectedRow, openDialog, handleCloseDialog, submitted, deleteQuote }) => {
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openRefDialog, setOpenRefDialog] = useState(false);

    const handleOpen = () => { setOpen(true); handleCloseDialog() }
    const handleClose = () => { setOpen(false); }

    const closeRefundDialog = () => setOpenRefDialog(false);

    const handleRefundBtnClick = () => {
        setOpenRefDialog(true);
        handleCloseDialog();
    }

    const handleRefresh = () => { submitted; }

    const deleteQuotation = (InvoiceNumber) => {
        setOpenDelete(false);
        deleteQuote(InvoiceNumber);
    }
 
    return (
        <Box>
            <Dialog open={openDialog} maxWidth='md' fullWidth>
                <DialogTitle sx={{ backgroundColor: 'darkblue', display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <div/>
                    <Typography sx={{ fontSize: '22px', fontWeight: '600', color: 'white' }}>Transaction Details</Typography>
                    <IconButton onClick={handleCloseDialog} color='error'>
                        <Typography fontSize='1em' color='red'>Close</Typography>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
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
                <DialogActions sx={{ backgroundColor: 'darkblue', display: 'flex', justifyContent: 'flex-end', gap: 1, padding: 2 }}>
                    {
                        selectedRow.InvoiceStatus === "Proforma Invoice" && (<>
                            <Button variant='contained' color='error' size='medium' onClick={() => setOpenDelete(true)}>Delete Quote</Button>
                            <Button variant='contained' color='warning' size='medium' onClick={handleOpen}>Update Quote</Button>
                        </>)
                    }{
                        selectedRow.InvoiceStatus === "Invoice" && (<>                        
                            <Button variant='contained' color='warning' size='medium' onClick={() => handleRefundBtnClick()}>Refund Invoice</Button>
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
                < InvoiceForm
                    BackdropOpen={setOpen} 
                    quoteProducts={selectedRow} 
                    setSubmitted={submitted}
                    handleCloseDialog={handleClose}
                    appBarMsg={'Update Invoice Quotation'}
                />
            </Dialog>
            <Dialog
                fullWidth
                maxWidth="md"
                open={openRefDialog}
            >
                <RefundForms
                    handleClose={closeRefundDialog}
                    refundInv={selectedRow}
                    setSubmitted={handleRefresh}
                />
            </Dialog>            
            <Dialog open={openDelete} sx={{ padding: '20px' }}>
                <DialogTitle color='red' variant='h3'>Heads-Up</DialogTitle>
                <DialogContent>
                    <Typography variant='h4' align='center'>
                        Are you sure you want to remove this quotation?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)} variant='outlined' color='error'>Cancel</Button>
                    <Button onClick={() => deleteQuotation(selectedRow.InvoiceNumber)} variant='contained' color='primary'>Remove</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default InvoiceDetails;
