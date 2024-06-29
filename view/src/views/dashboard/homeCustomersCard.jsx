import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
	Avatar,
	Box,
	Grid,
	List,
	Menu,
	MenuItem,
	Typography
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Analytics, CalendarMonth, Today } from '@mui/icons-material';
import { CalendarIcon } from '@mui/x-date-pickers';

/* eslint-disable */

// Projects
import sales from '../../assets/images/icons/sales.png'
import SkeletonEarningCard from '../../ui-component/cards/Skeleton/EarningCard';
import {
	fetchAllMonthSalesInvoices,
	fetchAllTodaySalesInvoices,
	fetchAllWeekSalesInvoices,
	fetchAllYearSalesInvoices,
} from '../../apiActions/allApiCalls/invoice';
import { formatCurrencyNumber } from '../../utilities/formatAmount';
import { CardWrapper, CustomLLogo } from '../../ui-component/colorsCardWrapper';


const TotalCustomersCard = ({ isLoading }) => {
	const theme = useTheme();

	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedPeriod, setSelectedPeriod] = useState('today');
	const [invoice, setInvoice] = useState([]);
	const [period, setPeriod] = useState('');

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = (period) => {
		setSelectedPeriod(period);
		handleClose();
	};

	const fetchData = async () => {
		try {
			switch (selectedPeriod) {
				case 'today':
					const today = await fetchAllTodaySalesInvoices();
					if (Array.isArray(today)) {
						setInvoice(today);
						setPeriod("Today's Transactions");
					} else {
						setInvoice([]);
					}
					break;
				case 'week':
					const week = await fetchAllWeekSalesInvoices();
					setInvoice(week);
					setPeriod("This Week Transactions");
					break;
				case 'month':
					const month = await fetchAllMonthSalesInvoices();
					setInvoice(month);
					setPeriod("This Month Transactions");
					break;
				case 'year':
					const year = await fetchAllYearSalesInvoices();
					setInvoice(year);
					setPeriod("This Year transactions");
					break;
			}
		}
		catch (error) {
			return null;
		}
	}

	useEffect(() => {
		fetchData();
	}, [selectedPeriod]);

	return (
		<>
			{isLoading ? (
				<SkeletonEarningCard />
			) : (
				<CardWrapper theme={'#2238A2'}>
					<Grid container direction="column" borderLeft='3px dashed gold'>
						<Grid item>
							<Grid container justifyContent="space-between">
								<Grid item>
									<Box sx={{ p: 1 }}>	
										<List sx={{ py: 0 }}>
											<CustomLLogo
												border={0}
												avatarIcon={sales}
											/>
										</List>
									</Box>
								</Grid>
								<Grid item>
									<Typography variant="h3" color="#7008AF" align="center">Sales</Typography>
								</Grid>
								<Grid item>
									<Avatar
										variant="rounded"
										sx={{
											...theme.typography.commonAvatar,
											...theme.typography.mediumAvatar,
											backgroundColor: theme.palette.secondary.dark,
											color: theme.palette.secondary[200],
											zIndex: 1
										}}
										onClick={handleClick}
									>
										<MoreHorizIcon fontSize="inherit" />
									</Avatar>
									<Menu
										id="menu-earning-card"
										anchorEl={anchorEl}
										keepMounted
										open={Boolean(anchorEl)}
										onClose={handleClose}
										variant="selectedMenu"
										anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
										transformOrigin={{ vertical: 'top', horizontal: 'right' }}
									>
										<MenuItem onClick={() => handleMenuItemClick('today')}>
											<Today sx={{ mr: 1.75 }} /> Today
										</MenuItem>
										<MenuItem onClick={() => handleMenuItemClick('week')}>
											<CalendarIcon sx={{ mr: 1.75 }} /> This Week
										</MenuItem>
										<MenuItem onClick={() => handleMenuItemClick('month')}>
											<CalendarMonth sx={{ mr: 1.75 }} /> This Month
										</MenuItem>
										<MenuItem onClick={() => handleMenuItemClick('year')}>
											<Analytics sx={{ mr: 1.75 }} /> This Year
										</MenuItem>
									</Menu>
								</Grid>
							</Grid>
						</Grid>
						<Grid item marginTop={-2}>
							<Grid container alignItems="center" justifyContent='center' justifyItems='center' flexDirection='column'>
								<Grid item>
									<Typography
										sx={{
											color: 'gold',
											fontSize: '23px',
											textAlign: 'center',
										}}
									>
										¢{formatCurrencyNumber(invoice.reduce((e, invoice) => {
											return e + parseFloat(invoice.Inv_total_amt);
										}, 0))}
									</Typography>
								</Grid>
								<Grid item>
									<Typography
										sx={{
											color: '#7008AF',
											fontSize: '18px',
											textAlign: 'center',
										}}
									>[ {invoice.length} ]</Typography>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid container justifyContent='center'>
						<Grid item>
							<Typography>{period}</Typography>
						</Grid>
					</Grid>
				</CardWrapper>
			)}
		</>
	);
};

TotalCustomersCard.propTypes = {
	isLoading: PropTypes.bool
};

export default TotalCustomersCard;
