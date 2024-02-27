import PropTypes from 'prop-types';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Grid, Typography } from '@mui/material';
import Chart from 'react-apexcharts';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import SkeletonTotalOrderCard from '../../ui-component/cards/Skeleton/EarningCard';
import ThisMonthTaxes from './chart-data/thisMonthlyTaxes';
import ChartDataYear from './chart-data/total-order-year-line-chart';

const CardWrapper = styled(MainCard)(({ theme }) => ({
	backgroundColor: '#040452',
	color: '#fff',
	overflow: 'hidden',
	position: 'relative',
}));

const TotalTaxes = ({ isLoading, vats, levies }) => {
	const [timeValue, setTimeValue] = useState(false);
	// const theme = useTheme();


	const handleChangeTime = (event, newValue) => {
		setTimeValue(newValue);
	};

	return (
		<>
			{isLoading ? (
				<SkeletonTotalOrderCard />
			) : (
				<CardWrapper border={false} content={false}>
					<Box sx={{ p: 2.25, height: '200px' }}>
						<Grid container direction="column">
							<Grid item>
								<Grid container justifyContent="space-between">
									<Grid item>
										<Typography variant="h3" color="white" align="center" mt={1} gutterBottom>Taxes</Typography>
									</Grid>
									<Grid item>
										<Button
											disableElevation
											variant={timeValue ? 'contained' : 'text'}
											size="small"
											sx={{ color: 'inherit' }}
											onClick={(e) => handleChangeTime(e, true)}
										>
											VAT
										</Button>
										<Button
											disableElevation
											variant={!timeValue ? 'contained' : 'text'}
											size="small"
											sx={{ color: 'inherit' }}
											onClick={(e) => handleChangeTime(e, false)}
										>
											LEVIES
										</Button>
									</Grid>
								</Grid>
							</Grid>
							<Grid item sx={{ mb: 0.75 }}>
								<Grid container alignItems="center">
									<Grid item xs={6}>
										<Grid container alignItems="center">
											<Grid item>
												{timeValue ? (
													<Typography sx={{ fontSize: '1.5rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>¢{vats}</Typography>
												) : (
													<Typography sx={{ fontSize: '1.5rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>¢{levies}</Typography>
												)}
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs={6}>
										{timeValue ? <Chart {...ThisMonthTaxes} /> : <Chart {...ChartDataYear} />}
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Box>
				</CardWrapper>
			)}
		</>
	);
};

TotalTaxes.propTypes = {
	isLoading: PropTypes.bool
};

export default TotalTaxes;
