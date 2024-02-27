import { ThemeProvider } from '@mui/material';
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
} from '@mui/material';

const InvoiceDetails = ({ selectedRow, openDialog, handleCloseDialog }) => {
    return (
        <ThemeProvider theme='white'>
            <Dialog open={openDialog} onClose={false}>
                <DialogContent>
                    <Typography sx={{ fontSize: '22px', textAlign: "center", fontWeight: '600', fontStyle: 'italic' }}>Invoice Details</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ borderCollapse: 'collapse' }} size='small' width='100%'>
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th" scope="row">Invoice #:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.Inv_Number}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Served By:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.Inv_user}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Customer Name:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.customerName}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Customer TIN:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.Inv_Customer_Tin}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Transaction Date:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.Inv_date}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Invoice Type:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.Inv_Type}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Invoice Status:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.Inv_status}</TableCell>
                                </TableRow>
                                {
                                    selectedRow.Inv_delivery_fee === null || selectedRow.Inv_delivery_fee === undefined || selectedRow.Inv_delivery_fee === "" || selectedRow.Inv_delivery_fee === 0 ? 
                                    null : (
                                        <TableRow>
                                            <TableCell component="th" scope="row">Delivery</TableCell>
                                            <TableCell component="td" scope="row">{selectedRow.Inv_delivery_fee}</TableCell>
                                        </TableRow>
                                    )
                                }
                                <TableRow>
                                    <TableCell component="th" scope="row">Discount:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.currency} {selectedRow.Inv_discount}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Total VAT:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.currency} {selectedRow.Inv_vat}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Total Levies:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.currency} {(
                                        parseFloat(selectedRow.cst) +
                                        parseFloat(selectedRow.nhil) +
                                        parseFloat(selectedRow.getfund) +
                                        parseFloat(selectedRow.covid) +
                                        parseFloat(selectedRow.tourism)
                                    ).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">Total Amount:</TableCell>
                                    <TableCell component="td" scope="row">{selectedRow.currency} {selectedRow.Inv_total_amt}</TableCell>
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
                                            <TableCell>{index+1}</TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.price}</TableCell>
                                            <TableCell>{product.quantity}</TableCell>
                                            <TableCell>{product.discount}</TableCell>
                                            <TableCell>{product.refundedQty}</TableCell>
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
        </ThemeProvider>
    );
}

export default InvoiceDetails;