import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Analytics, CalendarMonth, Today } from '@mui/icons-material';
import { CalendarIcon } from '@mui/x-date-pickers';

// Projects
import MainCard from '../../ui-component/cards/MainCard';
import SkeletonEarningCard from '../../ui-component/cards/Skeleton/EarningCard';
import {
	fetchAllMonthSalesInvoices,
	fetchAllTodaySalesInvoices,
	fetchAllWeekSalesInvoices,
	fetchAllYearSalesInvoices,
} from 'apiActions/allApiCalls/invoice';
import { formatCurrencyNumber } from 'utilities/formatAmount';

const CardWrapper = styled(MainCard)(({ theme }) => ({
	backgroundColor: '#060905',
	color: '#fff',
	overflow: 'hidden',
	position: 'relative',
}));

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
			console.log(error);
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
				<CardWrapper border={false} content={false}>
					<Box sx={{ p: 2, height: '200px', justifyContent: "space-between" }}>
						<Grid container columnSpacing={2} direction="column">
							<Grid item>
								<Grid container justifyContent="space-between">
									<Grid item>
										<Typography variant="h3" color="white" align="center" mt={1} gutterBottom>Sales</Typography>
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
							<Grid item>
								<Grid container alignItems="center" justifyContent='center' justifyItems='center' flexDirection='column'>
									<Grid item>
										<Typography 
											sx={{ 
												color: 'gold',
												padding: 2,
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
												color: 'lightpink',
												fontSize: '18px',
												textAlign: 'center',
												paddingBottom: 3,
											}}
										>{`[ `}{invoice.length}{` ]`}</Typography>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
						<Typography sx={{bottom: 0, textAlign: 'center' }}>{period}</Typography>
					</Box>
				</CardWrapper>
			)}
		</>
	);
};

TotalCustomersCard.propTypes = {
	isLoading: PropTypes.bool
};

export default TotalCustomersCard;
