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
import { Dangerous, EditNote, Verified } from '@mui/icons-material';
import { sendEmailToUser, updateUserStatus } from 'apiActions/allApiCalls/users';
import { AlertError } from 'utilities/errorAlert';
import UpdateUser from './updateUser';

/* eslint-disable */

const UserRow = ({ user, setSubmitted }) => {
	const [open, setOpen] = useState(false);
	const [loadEmail, setLoadEmail] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [updateDialog, setUpdateDialog] = useState(false);
	const [alert, setAlert] = useState({ message: "", color: "" });

	const openData = () => { setOpen(!open) };

	const sendEmail = async (event, user) =>{
		try {
			setLoadEmail(true);
			event.preventDefault();
			if (user.Usr_email && user.activated === 'no') {
				const data = await sendEmailToUser(user);
				if (data) {
					setTimeout(() => {
						setAlert((state) => ({
							...state,
							message: `verification email sent to ${user.Usr_email}`, color: "success"
						}));
						setOpenAlert(true);
						setLoadEmail(false);
					}, 2000);
				}
			} else {
				setAlert((state) => ({
					...state,
					message: `${user.Usr_email} is already verified`, color: "secondary"
				}));
				setOpenAlert(true);
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
			setAlert((e) => ({...e, message: 'something unexpected happend!', color: 'error'}));
			setOpenAlert(true);
        }
	}

	const handleUpdateUser = (event) => {
		event.preventDefault();
		setUpdateDialog(true);
	}

	return (
		<>
			{alert.message ? (<AlertError open={openAlert} alert={alert} handleClose={()=>setOpenAlert(false)}/>) : null}
			<TableRow key={user.Usr_id}>
				<TableCell padding='none'>
					<IconButton style={{ cursor: 'pointer' }} size="small" onClick={openData}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} component="th" scope="row" onClick={openData}>{user.Usr_name}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{user.Usr_email}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{user.Usr_phone || '-'}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} onClick={openData}>{user.Usr_reg_date}</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} align='center'>
					<Button
						onClick={() => activatAndDisableeUser(event, user.Usr_id, user)}
						variant='outlined'
						size='small'
						color={user.Usr_status === 'active' ? 'primary' : 'error'}
					>
						{user.Usr_status}
					</Button>
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }} align='center'>
					<Button 
						onClick={(event) => sendEmail(event, user)} 
						variant='text'
						size='small'
						color={user.activated === 'yes' ? 'success' : 'error'}
					>
						{user.activated === 'yes' ? <Verified /> : (loadEmail === true ? <CircularProgress color='error' size={20}/> : < Dangerous />)}
					</Button>
				</TableCell>
				<TableCell padding='none' style={{ cursor: 'pointer' }}align='right'>
					<Button 
						onClick={() => handleUpdateUser(event)}
						variant='outlined' 
						size='small'sx={{ color: '#DDAC05'}}
					>
						<EditNote />
					</Button>
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
										<TableCell padding='none' align='left'>{user.Usr_FName || '-'}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Last Name</TableCell>
										<TableCell padding='none' align='left'>{user.Usr_LName || '-'}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Department</TableCell>
										<TableCell padding='none' align='left'>{user.Usr_dept || '-'}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>User Type</TableCell>
										<TableCell padding='none'>{user.Usr_type || '-'}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell padding='none'>Address</TableCell>
										<TableCell padding='none'>{user.Usr_address || '-'}</TableCell>
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

			<Dialog open={updateDialog}>
                    <UpdateUser user={user} closeAddnewUser={()=>setUpdateDialog(false)} setSubmitted={setSubmitted} />
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
			<UserRow key={data.Usr_id} user={data} setSubmitted={submission}/>
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
								<TableCell><Typography variant='h4' color='white' align='right'>Edit</Typography></TableCell>
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