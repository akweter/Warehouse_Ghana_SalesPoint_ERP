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
	Rating,
	Dialog,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import UpdateCusNSup from './updateSupNCus';

const CusNsupRow = ({ cusNsup, setSubmitted }) => {
	const [updateDialog, setUpdateDialog] = useState(false);
	const [open, setOpen] = useState(false);

	const openData = () => setOpen(!open);
	
	const handleUpdateUser = () => {
		setUpdateDialog(true);
	}

	return (
		<>
			<TableRow>
				<TableCell padding='none'>
					<IconButton style={{ cursor: 'pointer' }} size="small" onClick={openData}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} component="th" scope="row" onClick={openData}>{cusNsup.userType}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{cusNsup.userName}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{cusNsup.userTIN}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{cusNsup.userRegion}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{cusNsup.userStatus}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>
					<Rating name="read-only" value={cusNsup.userRating} readOnly />
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={() => handleUpdateUser()} align='right'>
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
										<TableCell padding='none' align='left'>{cusNsup.userTIN}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Email</TableCell>
										<TableCell padding='none'>{cusNsup.userEmail}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Telephone</TableCell>
										<TableCell padding='none'>{cusNsup.userPhone}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Tax Status</TableCell>
										<TableCell padding='none'>{cusNsup.userStatus}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Address</TableCell>
										<TableCell padding='none'>{cusNsup.userAddress}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Date Added</TableCell>
										<TableCell padding='none'>{cusNsup.userAddedDate}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Rating</TableCell>
										<TableCell padding='none'>{cusNsup.userRating}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Exemption</TableCell>
										<TableCell padding='none'>{cusNsup.userExemption}</TableCell>
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

			<Dialog open={updateDialog}>
                    <UpdateCusNSup user={cusNsup} closeAddnewUser={()=>setUpdateDialog(false)} setSubmitted={setSubmitted} />
            </Dialog>
		</>
	);
};

const CustomersSuppliersTable = ({ inData, setSubmitted }) => {
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
			<CusNsupRow key={data.userID} cusNsup={data} setSubmitted={setSubmitted}/>
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
								<TableCell><Typography variant='h4' color='white'>Rating</Typography></TableCell>
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
