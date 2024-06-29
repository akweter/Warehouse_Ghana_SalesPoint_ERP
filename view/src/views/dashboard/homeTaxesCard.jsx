import PropTypes from 'prop-types';
import { useState } from 'react';
import { Box, Button, Grid, List, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import graph from '../../assets/images/icons/graph.png'

// project imports
import SkeletonTotalOrderCard from '../../ui-component/cards/Skeleton/EarningCard';
import ThisMonthTaxes from './chart-data/thisMonthlyTaxes';
import ChartDataYear from './chart-data/total-order-year-line-chart';
import { CardWrapper, CustomLLogo } from '../../ui-component/colorsCardWrapper';

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
					<Grid container direction="column" borderBottom='3px dashed gold'>
						<Grid item>
							<Grid container justifyContent="space-between">
								<Grid item>
									<Box>
										<List>
											<CustomLLogo
												border={0}
												avatarIcon={graph}
											/>
										</List>
									</Box>
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
						<Grid item marginTop={-2}>
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
				</CardWrapper>
			)}
		</>
	);
};

TotalTaxes.propTypes = {
	isLoading: PropTypes.bool
};

export default TotalTaxes;
