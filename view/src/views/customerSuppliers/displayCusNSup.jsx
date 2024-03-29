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

const CusNsupRow = ({ cusNsup }) => {
	const [open, setOpen] = React.useState(false);

	const openData = () => {
		setOpen(!open);
	};

	return (
		<>
			<TableRow>
				<TableCell padding='none'>
					<IconButton style={{ cursor: 'pointer' }} size="small" onClick={openData}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} component="th" scope="row" onClick={openData}>{cusNsup.SnC_Type}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{cusNsup.SnC_name}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{cusNsup.SnC_tin}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{cusNsup.SnC_region}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{cusNsup.SnC_status}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={() => alert('édited')} align='right'>
					<Button variant='outlined' sx={{ backgroundColor: '#0C0E81', color: 'white' }}>Edit</Button>
				</TableCell>
			</TableRow>

			<TableRow>
				<TableCell padding='none' style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Table size="small" style={{ marginLeft: 50 }}>
								<TableHead>
									<TableRow>
										<TableCell padding='none'>TIN</TableCell>
										<TableCell padding='none' align='left'>{cusNsup.SnC_tin}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Email</TableCell>
										<TableCell padding='none'>{cusNsup.SnC_email}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Telephone</TableCell>
										<TableCell padding='none'>{cusNsup.SnC_phone}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Tax Status</TableCell>
										<TableCell padding='none'>{cusNsup.SnC_status}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Address</TableCell>
										<TableCell padding='none'>{cusNsup.SnC_address}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Date Added</TableCell>
										<TableCell padding='none'>{cusNsup.SnC_Date}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Rating</TableCell>
										<TableCell padding='none'>{cusNsup.SnC_rating}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Exemption</TableCell>
										<TableCell padding='none'>{cusNsup.SnC_exempted}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Products Bought/supplied</TableCell>
										<TableCell padding='none'>Milk{/*{cusNsup.tags.map(e => e.productName).join(', ')}*/}</TableCell>
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

const CustomersSuppliersTable = ({ inData }) => {
	const itemsPerPage = 25;
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
		const currentPageData = inData.slice(startIndex, endIndex);

		return currentPageData.map(data => (
			<CusNsupRow key={data.SnC_id} cusNsup={data} />
		));
	};

	return (
		<>
			<Box height={550} overflow='scroll'>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow style={{ backgroundColor: 'darkblue' }}>
								<TableCell><Typography variant='h4' color='white'>{inData.length}</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>Type</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>Name</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>TIN</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>Region</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>Status</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white' align='right'>Action</Typography></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{renderData()}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			<Button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
			<Button onClick={handleNextPage} disabled={currentPage * itemsPerPage >= inData.length}>Next</Button>
		</>
	);
};


export default CustomersSuppliersTable;
