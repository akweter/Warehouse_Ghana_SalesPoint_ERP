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
import { Dangerous, Verified } from '@mui/icons-material';
import { updateUserStatus } from 'apiActions/allApiCalls/users';

const UserRow = ({ user, setSubmitted }) => {
	const [open, setOpen] = React.useState(false);
	const openData = () => {
		setOpen(!open);
	};

	const activatAndDisableeUser = async(id, action) => {
		try {
            const data = await updateUserStatus(id, action);
			console.log(data);
			if (data.ok) {
				setSubmitted();
			}
        }
        catch (error) {
        }
	}

	return (
		<>
			<TableRow>
				<TableCell padding='none'>
					<IconButton style={{ cursor: 'pointer' }} size="small" onClick={openData}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} component="th" scope="row" onClick={openData}>{user.Usr_name}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{user.Usr_email}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{user.Usr_phone === undefined || user.Usr_phone === null ? '-' : user.Usr_phone}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{user.Usr_reg_date}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} align='center'>
					<Button
						onClick={() => activatAndDisableeUser(user.Usr_id, user.Usr_status)}
						variant='outlined'
						size='small'
						color={user.Usr_status === 'active' ? 'success' : 'error'}
					>
						{user.Usr_status}
					</Button>

				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={()=>alert('verufied')} align='center'>
					<Button variant='text' size='small' color={user.activated === 'yes' ? 'primary' : 'error'}>
						{user.activated === 'yes' ? <Verified /> : < Dangerous />}
					</Button>
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={() => alert(`You are editing ${user.Usr_name}'s profile`)} align='right'>
					<Button variant='outlined' size='small' sx={{ backgroundColor: '#0C0E81', color: 'white' }}>Edit</Button>
				</TableCell>
			</TableRow>

			<TableRow>
				<TableCell padding='none' style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Table size="small" style={{ marginLeft: 50 }}>
								<TableHead>
									<TableRow>
										<TableCell padding='none'>First Name</TableCell>
										<TableCell padding='none' align='left'>{user.Usr_FName === null || user.Usr_FName === undefined ? '-' : user.Usr_FName}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Last Name</TableCell>
										<TableCell padding='none' align='left'>{user.Usr_LName === null || user.Usr_LName === undefined ? '-' : user.Usr_LName}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Department</TableCell>
										<TableCell padding='none' align='left'>{user.Usr_dept === null || user.Usr_dept === undefined ? '-' : user.Usr_dept}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>User Type</TableCell>
										<TableCell padding='none'>{user.Usr_type === null || user.Usr_type === undefined ? '-' : user.Usr_type}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Address</TableCell>
										<TableCell padding='none'>{user.Usr_address === null || user.Usr_address === undefined ? '-' : user.Usr_address}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Activities</TableCell>
										<TableCell padding='none'><Button variant='text'>Click Here</Button>{/*{user.tags.map(e => e.Itm_name).join(', ')}*/}</TableCell>
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

const DisplayUsers = ({ inData, submission }) => {
	
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
			<UserRow key={data.id} user={data} setSubmitted={submission}/>
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
								<TableCell><Typography variant='h4' color='white'>User Name</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>Email</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>Telephone</Typography></TableCell>
								<TableCell><Typography variant='h4' color='white'>Registration Date</Typography></TableCell>
								<TableCell><Typography variant='h4' align='center' color='white'>Status</Typography></TableCell>
								<TableCell><Typography variant='h4' align='center' color='white'>Verify</Typography></TableCell>
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

export default DisplayUsers; 