import React, { useState } from 'react';
import PropTypes from 'prop-types';
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

const WooCommerceRow = ({ customer }) => {
	const [open, setOpen] = useState(false);

	const openData = () => {
		setOpen(!open);
	}

	return (
		<>
			<TableRow>
				<TableCell padding='none'>
					<IconButton style={{ cursor: 'pointer' }} size="small" onClick={openData}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell padding='none' onClick={openData} style={{ cursor: 'pointer' }}>{customer.first_name} {customer.last_name}</TableCell>
				<TableCell padding='none' onClick={openData} style={{ cursor: 'pointer' }}>{customer.billing.phone}</TableCell>
				<TableCell padding='none' onClick={openData} style={{ cursor: 'pointer' }}>{customer.email}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell padding='none' style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Table size="small" style={{ marginLeft: 50 }}>
								<TableHead>
									<TableRow>
										<TableCell padding='none'>Username</TableCell>
										<TableCell padding='none'>{customer.username}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none' >Address</TableCell>
										<TableCell padding='none'>{customer.billing.address_1}, {customer.billing.city}, {customer.billing.country === 'GH' ? 'Ghana' : customer.billing.country}</TableCell>
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

WooCommerceRow.propTypes = {
	customer: PropTypes.object.isRequired,
};

const CustomersTable = ({ data }) => {
	const customers = [...data];

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
		const currentPageData = customers.slice(startIndex, endIndex);

		return currentPageData.map(data => (
			<WooCommerceRow key={data.id} customer={data} />
		));
	};

	return (
		<>
			<Box height={500} overflow='scroll'>
				<TableContainer component={Paper}>
					<Table aria-label="collapsible table">
						<TableHead>
							<TableRow sx={{ backgroundColor: 'darkblue' }}>
								<TableCell><Typography variant='h4' color='white'>{customers.length}</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>Name</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white' paddingRight={20}>Telephone</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>Email</Typography></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{renderData()}
						</TableBody>
					</Table>
				</TableContainer>
				<Button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
				<Button onClick={handleNextPage} disabled={currentPage * itemsPerPage >= customers.length}>Next</Button>
			</Box>
		</>
	);
};

export default CustomersTable;
