/* eslint-disable */
import React, {  } from 'react';
import {
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    TableBody,
} from '@mui/material';

const DeliveryDetails = ({ selectedRow }) => {
    return (
        <Box>
            <TableContainer component={Paper}>
                <Table sx={{ borderCollapse: 'collapse' }} size='small' width='100%'>
                    <TableHead>
                        <TableRow>
                            <TableCell component="th" scope="row">Invoice #:</TableCell>
                            <TableCell component="td" scope="row">{selectedRow.InvoiceNumber || 'Unavailable'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Totoal Amount:</TableCell>
                            <TableCell component="td" scope="row">{selectedRow.Currency || ''}: {selectedRow.TotalAMount || 0.00}</TableCell>
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
                            <TableCell component="td" scope="row">
                                { selectedRow.CustomerTin !== "C0000000000" ? selectedRow.CustomerTin : "Cash" }
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Recipient Name:</TableCell>
                            <TableCell component="td" scope="row">{selectedRow.RecipientName || 'Unavailable'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Recipient Phone:</TableCell>
                            <TableCell component="td" scope="row">{selectedRow.RecipientPhone || 'Unavailable'} </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Despatch Adress:</TableCell>
                            <TableCell component="td" scope="row">{selectedRow.RecipientAddress || 'Unavailable'} </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Delivered By:</TableCell>
                            <TableCell component="td" scope="row">{selectedRow.DeliveryName || 'Unavailable'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Delivered Phone:</TableCell>
                            <TableCell component="td" scope="row">{selectedRow.DeliveryPhone || 'Unavailable'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row">Despatch Date:</TableCell>
                            <TableCell component="td" scope="row">{selectedRow.DespatchDate || 'Unavailable'}</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>

                {/* Products table... */}
                {Array.isArray(selectedRow.products) && selectedRow.products.length > 0 ? (
                        <TableContainer component={Paper} sx={{ marginTop: '10px' }}>
                            {!selectedRow.products[0].OrderedProducts ?
                                <Typography variant='body2'>Products not delivered yet</Typography>
                            :
                                <Table sx={{ minWidth: 500, borderCollapse: 'collapse' }} size='small'>
                                    <TableHead sx={{ backgroundColor: 'lightgray' }}>
                                        <TableRow>
                                            <TableCell variant='footer'>#</TableCell>
                                            <TableCell variant='footer'>SKU</TableCell>
                                            <TableCell variant='footer'>Description</TableCell>
                                            <TableCell variant='footer'>Ordered</TableCell>
                                            <TableCell variant='footer'>Delivered</TableCell>
                                            <TableCell variant='footer'>Outstanding</TableCell>
                                            {/* <TableCell variant='footer'>Category</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedRow.products.map((product, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{product.SKU || 'Unavailable'}</TableCell>
                                                <TableCell>{product.ProductName || 'Unavailable'}</TableCell>
                                                <TableCell>{product.OrderedProducts || 'Unavailable'}</TableCell>
                                                <TableCell>{product.DeliveredProducts}</TableCell>
                                                <TableCell>{product.OutstandingProducts}</TableCell>
                                                {/* <TableCell>{product.ProductCategory || 'Unavailable'}</TableCell> */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            }
                        </TableContainer>
                    ) : (
                        <p>Products not available</p>
                    )
                }
            </TableContainer>
        </Box>
    );
}

export default DeliveryDetails;
