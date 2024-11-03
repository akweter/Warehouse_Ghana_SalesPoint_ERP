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
            </TableContainer>
        </Box>
    );
}

export default DeliveryDetails;
