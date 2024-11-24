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
	CircularProgress,
	Dialog,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Dangerous, Edit, Verified } from '@mui/icons-material';

import { sendEmailToUser, updateUserStatus } from '../../apiActions/allApiCalls/users';
import { AlertError } from '../../utilities/errorAlert';
import UpdateUser from './updateUser';

/* eslint-disable */

const UserRow = ({ user, setSubmitted }) => {
	const [open, setOpen] = useState(false);
	const [loadEmail, setLoadEmail] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [updateDialog, setUpdateDialog] = useState(false);
	const [alert, setAlert] = useState({ message: "", color: "" });

	const openData = () => { setOpen(!open) };

	const sendEmail = async (event, user) => {
		try {
			setLoadEmail(true);
			event.preventDefault();
			const data = await sendEmailToUser(user);
			if (data.message === 'email_sent') {
				setTimeout(() => {
					setAlert((state) => ({
						...state,
						message: `Password reset email sent to ${user.primaryEmail}`, color: "success"
					}));
					setOpenAlert(true);
					setLoadEmail(false);
				}, 2000);
			}
		}
		catch (error) {
			setAlert((state) => ({
				...state,
				message: `Something Unexpected happend. please try again`, color: "error"
			}));
			setOpenAlert(true);
			return null;
		}
	}

	const activatAndDisableeUser = async (event, id, user) => {
		try {
			event.preventDefault();
			await updateUserStatus(id, user);
			setTimeout(() => {
				setSubmitted(true);
			}, 100);
		}
		catch (error) {
			setAlert((e) => ({ ...e, message: 'something unexpected happend!', color: 'error' }));
			setOpenAlert(true);
		}
	}

	const handleUpdateUser = (event) => {
		event.preventDefault();
		setUpdateDialog(true);
	}

	return (
		<>
			{alert.message ? (<AlertError open={openAlert} alert={alert} handleClose={() => setOpenAlert(false)} />) : null}
			<TableRow key={user.accountId}>
				<TableCell padding='none'>
					<IconButton style={{ cursor: 'pointer' }} size="small" onClick={openData}> 
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} component="th" scope="row">
					<Button variant='text' onClick={() => window.alert(`you just selected ${user.userName}`)}>{user.userName}</Button>
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{user.primaryEmail}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{user.telephone || '-'}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{user.regDate}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} align='center'>
					<Button
						onClick={() => activatAndDisableeUser(event, user.accountId, user)}
						variant='outlined'
						size='small'
						color={user.accountStat === 'active' ? 'primary' : 'error'}
					>
						{user.accountStat}
					</Button>
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} align='center'>
					<Button
						onClick={(event) => sendEmail(event, user)}
						variant='text'
						size='small'
						color={user.userSubscribed === 'yes' ? 'success' : 'error'}
					>
						{
							loadEmail === true ?
							(<CircularProgress color='error' size={20}/>) :
							(user.userSubscribed === 'yes' ? (<Verified/>) : (< Dangerous />))
						}
					</Button>
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} align='right' onClick={() => handleUpdateUser(event)}>
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
										<TableCell padding='none'>First Name</TableCell>
										<TableCell padding='none' align='left'>{user.userFName || '-'}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Last Name</TableCell>
										<TableCell padding='none' align='left'>{user.userLName || '-'}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Department</TableCell>
										<TableCell padding='none' align='left'>{user.orgDept || '-'}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>User Type</TableCell>
										<TableCell padding='none'>{user.accountType || '-'}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Address</TableCell>
										<TableCell padding='none'>{user.regAddress || '-'}</TableCell>
									</TableRow>
								</TableHead>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>

			<Dialog open={updateDialog}>
				<UpdateUser user={user} closeAddnewUser={() => setUpdateDialog(false)} setSubmitted={setSubmitted} />
			</Dialog>
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
			<UserRow key={data.accountId} user={data} setSubmitted={submission} />
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
								<TableCell><Typography variant='h4' color='darkred'>User Name</Typography></TableCell>
								<TableCell><Typography variant='h4' color='darkred'>Email</Typography></TableCell>
								<TableCell><Typography variant='h4' color='darkred'>Telephone</Typography></TableCell>
								<TableCell><Typography variant='h4' color='darkred'>Registration Date</Typography></TableCell>
								<TableCell><Typography variant='h4' align='center' color='darkred'>Status</Typography></TableCell>
								<TableCell><Typography variant='h4' align='center' color='darkred'>Reset psd</Typography></TableCell>
								<TableCell><Typography variant='h4' align='right' color='darkred'>Edit</Typography></TableCell>
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