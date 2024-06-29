import PropTypes from 'prop-types';
import { useState } from 'react';
import { Box, Button, Grid, List, Typography } from '@mui/material';

// project imports
import supplier from '../../assets/images/icons/supplier.jpg'
import SkeletonTotalOrderCard from '../../ui-component/cards/Skeleton/EarningCard';
import { CardWrapper, CustomLLogo } from '../../ui-component/colorsCardWrapper';

const TotalSuppliersCard = ({ isLoading, foreign, local }) => {

	const [timeValue, setTimeValue] = useState(false);
	const handleChangeTime = (event, newValue) => {
		setTimeValue(newValue);
	};

	return (
		<>
			{isLoading ? (
				<SkeletonTotalOrderCard />
			) : (
				<CardWrapper theme={'#2238A2'}>
					<Grid container flexDirection='column' borderRight='3px dashed gold'>
						<Grid item>
							<Grid container>
								<Grid item>
									<Box>	
										<List sx={{ py: 0 }}>
											<CustomLLogo
												border={0}
												avatarIcon={supplier}
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
										LOCAL
									</Button>
									<Button
										disableElevation
										variant={!timeValue ? 'contained' : 'text'}
										size="small"
										sx={{ color: 'inherit' }}
										onClick={(e) => handleChangeTime(e, false)}
									>
										FOREIGN
									</Button>
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<Grid container justifyContent='space-around'>
								<Grid item>
									{timeValue ? (
										<Typography sx={{ fontSize: '2.125rem', fontWeight: 500,}}>{local}</Typography>
									) : (
										<Typography sx={{ fontSize: '2.125rem', fontWeight: 500,}}>{foreign}</Typography>
									)}
								</Grid>
								<Grid item>
									<Typography sx={{ fontWeight: 300 }} color="#7008AF" variant='h3'>Suppliers</Typography>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</CardWrapper>
			)}
		</>
	);
};

TotalSuppliersCard.propTypes = {
	isLoading: PropTypes.bool
};

export default TotalSuppliersCard;
