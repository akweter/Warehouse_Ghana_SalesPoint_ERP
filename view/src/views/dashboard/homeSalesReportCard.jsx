import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';
import MainCard from '../../ui-component/cards/MainCard';
import SkeletonEarningCard from '../../ui-component/cards/Skeleton/EarningCard';

const CardWrapper = styled(MainCard)(({ theme }) => ({
	backgroundColor: '#771404',
	color: '#fff',
	overflow: 'hidden',
	position: 'relative',
}));

const TotalSalesCard = ({ isLoading, customers, products }) => {
	return (
		<>
			{isLoading ? (
				<SkeletonEarningCard />
			) : (
				<CardWrapper border={false} content={false}>
					<Box sx={{ p: 2.25, height: '200px', justifyContent: "center" }}>
						<Grid container spacing={3} textAlign='center' justifyContent='center' flexDirection='column-reverse'>
							<Grid item gap={2}>
								<Typography sx={{fontWeight: 250}} variant='h3' color='white'>Customers</Typography>
								<Typography sx={{fontWeight: 300}} variant='h3' color='white'>{`[`} {customers.length} {`]`}</Typography>
							</Grid>
							<Grid item gap={2}>
								<Typography sx={{fontWeight: 250}} variant='h3' color='white'>Products</Typography>
								<Typography  sx={{fontWeight: 300}} variant='h3' color='white'>{`[`} {products.length} {`]`}</Typography>
							</Grid>
						</Grid>
					</Box>
				</CardWrapper>
			)}
		</>
	);
};

TotalSalesCard.propTypes = {
	isLoading: PropTypes.bool
};

export default TotalSalesCard;
