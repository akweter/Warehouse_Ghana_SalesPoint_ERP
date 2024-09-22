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
import UpdateSupplier from './updateSupplier';
import { Edit } from '@mui/icons-material';

const CusNsupRow = ({ data, setSubmitted }) => {
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
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{data.supplierName || "-"}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{data.supplierTin || "-"}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{data.supplierID || "-"}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{data.supplierRegion || "-"}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{data.supplierStatus || "-"}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>
					<Rating name="read-only" value={data.supplierRating || "-"} readOnly />
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={() => handleUpdateUser()} align='right'>
					<Button variant='contained' style={{ background: 'darkred' }}><Edit fontSize='28px'/></Button>
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
										<TableCell padding='none' align='left'>{data.supplierTin || "Unavailable"}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Email</TableCell>
										<TableCell padding='none'>{data.supplierEmail || "Unavailable"}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Telephone</TableCell>
										<TableCell padding='none'>{data.supplierPhone || "Unavailable"}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Tax Status</TableCell>
										<TableCell padding='none'>{data.supplierStatus || "Unavailable"}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Address</TableCell>
										<TableCell padding='none'>{data.supplierAddress || "Unavailable"}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Date Added</TableCell>
										<TableCell padding='none'>{data.supplierAddedDate || "Unavailable"}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Rating</TableCell>
										<TableCell padding='none'>{data.supplierRating || 0}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Exemption</TableCell>
										<TableCell padding='none'>{data.supplierExempted || "Unavailable"}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Products Bought</TableCell>
										<TableCell padding='none'>{data.ProBoughtQty || 0}</TableCell>
									</TableRow>
								</TableHead>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>

			<Dialog open={updateDialog}>
                    <UpdateSupplier supplier={data} closeAddnewUser={()=>setUpdateDialog(false)} setSubmitted={setSubmitted} />
            </Dialog>
		</> 
	);
};

const SuppliersTable = ({ inData, setSubmitted }) => {
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
			<CusNsupRow key={data.supplierID} data={data} setSubmitted={setSubmitted}/>
		));
	};

	return (
		<>
			<Box height={550} sx={{ overflowX: 'scroll' }}>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow style={{ backgroundColor: 'lightgray', padding: 0, }}>
								<TableCell><Typography variant='h4' color='darkred'>{inData.length}</Typography></TableCell>
								<TableCell><Typography variant='h4' color='darkred'>Name</Typography></TableCell>
								<TableCell><Typography variant='h4' color='darkred'>TIN</Typography></TableCell>
								<TableCell><Typography variant='h4' color='darkred'>Account</Typography></TableCell>
								<TableCell><Typography variant='h4' color='darkred'>Region</Typography></TableCell>
								<TableCell><Typography variant='h4' color='darkred'>Status</Typography></TableCell>
								<TableCell><Typography variant='h4' color='darkred'>Rating</Typography></TableCell>
								<TableCell><Typography variant='h4' color='darkred' align='right'>Action</Typography></TableCell>
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
 
export default SuppliersTable;
