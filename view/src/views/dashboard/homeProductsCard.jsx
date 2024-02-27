import PropTypes from 'prop-types';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Grid, Typography } from '@mui/material';

// project imports
import MainCard from '../../ui-component/cards/MainCard';
import SkeletonTotalOrderCard from '../../ui-component/cards/Skeleton/EarningCard';

const CardWrapper = styled(MainCard)(({ theme }) => ({
	backgroundColor: '#097305',
	color: '#fff',
	overflow: 'hidden',
	position: 'relative',
}));

const TotalSuppliersCard = ({ isLoading, foreign, local }) => {
	// const theme = useTheme();

	const [timeValue, setTimeValue] = useState(false);
	const handleChangeTime = (event, newValue) => {
		setTimeValue(newValue);
	};

	return (
		<>
			{isLoading ? (
				<SkeletonTotalOrderCard />
			) : (
				<CardWrapper border={false} content={false} sx={{ justifyContent: 'center' }}>
					<Box sx={{ p: 2.25, height: '200px' }}>
						<Grid container direction="column">
							<Grid item>
								<Grid container justifyContent="space-between">
									<Grid item>
										<Typography variant="h3" color="white" align="center" mt={1} gutterBottom>Suppliers</Typography>
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
							<Grid item sx={{ mb: 0.75 }}>
								<Grid container justifyContent='space-between'>
									<Grid item xs={12}>
										{timeValue ? (
											<Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{local}</Typography>
										) : (
											<Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{foreign}</Typography>
										)}
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

TotalSuppliersCard.propTypes = {
	isLoading: PropTypes.bool
};

export default TotalSuppliersCard;
