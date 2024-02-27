import React, { useState } from 'react';
import {
    IconButton,
    Collapse,
    Table,
    TableRow,
    TableCell,
    Typography,
    TableContainer,
    TableBody,
    TableHead,
    Paper,
    Box,
    Button,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Row = ({ order }) => {
    const [open, setOpen] = useState(false);

    const openData = () => {
        setOpen(!open);
    }

    return (
        <>
            <TableRow>
                <TableCell style={{ cursor: 'pointer' }} padding='none'>
                    <IconButton aria-label="expand row" size="small" onClick={openData}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell style={{ cursor: 'pointer' }} padding='none' component="th" scope="row" onClick={openData}>
                    {order.id}
                </TableCell>
                <TableCell style={{ cursor: 'pointer' }} padding='none' align="right" onClick={openData}>{order.status}</TableCell>
                <TableCell style={{ cursor: 'pointer' }} padding='none' align="right" onClick={openData}>{order.total}</TableCell>
                <TableCell style={{ cursor: 'pointer' }} padding='none' align="right" onClick={openData}>{order.shipping_total}</TableCell>
            </TableRow>

            <TableRow>
                <TableCell padding='none' style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Table size="small" style={{ marginLeft: 50 }}>
                                <TableHead>
                                    <TableRow key={order.id}>
                                        <TableCell padding='none' align="left">Customer Name</TableCell>
                                        <TableCell padding='none'>{`${order.billing.first_name} ${order.billing.last_name}`}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell padding='none' align="left">Telephone:</TableCell>
                                        <TableCell padding='none'>{(order.billing.phone === "" || order.shipping.phone === "") ? 'Unavailable' : (order.billing.phone || order.shipping.phone)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell padding='none' align="left">Date</TableCell>
                                        <TableCell padding='none'>{order.date_created}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell padding='none' align="left">Total Items</TableCell>
                                        <TableCell padding='none'>{order.line_items.length}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell padding='none' align="left">Products</TableCell>
                                        <TableCell padding='none'>{order.line_items.map(e => e.name).join(', ')}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell padding='none' align="left">Payment Method</TableCell>
                                        <TableCell padding='none'>{order.payment_method_title}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell padding='none' align="left">Billing Address</TableCell>
                                        <TableCell padding='none'>{order.billing.address_1}, {order.billing.address_2} {order.billing.city}, {order.billing.country}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell padding='none' align="left">Delivery Address</TableCell>
                                        <TableCell padding='none'>{order.shipping.address_1}, {order.shipping.address_2} {order.shipping.city}, {order.shipping.country}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell padding='none' align="left">Delivery Note</TableCell>
                                        <TableCell padding='none'>{order.customer_note === "" ? 'Not Applicable' : order.customer_note}</TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const OrdersTable = ({ orders }) => {
    const itemsPerPage = 11;
	const [currentPage, setCurrentPage] = useState(1);

	const handleNextPage = () => {
		setCurrentPage(prevPage => prevPage + 1);
	};

	const handlePrevPage = () => {
		setCurrentPage(prevPage => prevPage - 1);
	};

	const renderData = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		const currentPageData = orders.slice(startIndex, endIndex);

		return currentPageData.map(data => (
            <Row key={data.id} order={data} />
		));
	};

    return (
        <Box height={500} overflow='scroll'>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'darkblue' }}>
                            <TableCell><Typography variant='h4' color='white'>{orders.length}</Typography></TableCell>
                            <TableCell><Typography variant='h4' color='white'>ID</Typography></TableCell>
                            <TableCell variant='h4' align="right"><Typography variant='h3' color='white'>Status</Typography></TableCell>
                            <TableCell variant='h4' align="right"><Typography variant='h3' color='white'>Total</Typography></TableCell>
                            <TableCell variant='h4' align="right"><Typography variant='h3' color='white'>Shipping</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderData()}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
			<Button onClick={handleNextPage} disabled={currentPage * itemsPerPage >= orders.length}>Next</Button>
		</Box>
    );
};

export default OrdersTable;
