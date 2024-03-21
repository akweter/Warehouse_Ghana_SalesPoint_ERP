import PropTypes from 'prop-types';
import { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalOrderCard from '../../ui-component/cards/Skeleton/EarningCard';
import ThisMonthTaxes from './chart-data/thisMonthlyTaxes';
import ChartDataYear from './chart-data/total-order-year-line-chart';
import { CardWrapper } from 'ui-component/colorsCardWrapper';

const TotalTaxes = ({ isLoading, vats, levies }) => {
	const [timeValue, setTimeValue] = useState(false);

	const handleChangeTime = (event, newValue) => {
		setTimeValue(newValue);
	};

	return (
		<>
			{isLoading ? (
				<SkeletonTotalOrderCard />
			) : (
				<CardWrapper theme={'#040452'}>
					<Grid container direction="column" borderBottom={2}>
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
						<Grid item>
							<Grid container alignItems="center">
								<Grid item xs={6}>
									<Grid container display='unset'>
										Here
									</Grid>
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
				</CardWrapper>
			)}
		</>
	);
};

TotalTaxes.propTypes = {
	isLoading: PropTypes.bool
};

export default TotalTaxes;
