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
} from '@mui/material';

const InvoiceDetails = ({ selectedRow, openDialog, handleCloseDialog }) => {
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
                                    <TableCell component="th" scope="row">Transaction Date:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.InvoiceDate || 'Unavailable'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Invoice Type:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.InvoiceType || 'Unavailable'}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Invoice Status:</TableCell>
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
                                    <TableCell component="td" scope="row">{selectedRow.currency} {selectedRow.TotalAmount || 0}</TableCell>
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
                                            <TableCell>{product.Quantity || 0}</TableCell>
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
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default InvoiceDetails;