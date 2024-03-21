import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import SkeletonEarningCard from '../../ui-component/cards/Skeleton/EarningCard';
import { CardWrapper } from 'ui-component/colorsCardWrapper';

const TotalSalesCard = ({ isLoading, customers, products }) => {
	return (
		<>
			{isLoading ? (
				<SkeletonEarningCard />
			) : (
				<CardWrapper theme={'#771404'}>
					<Grid container spacing={3} textAlign='center' flexDirection='column-reverse'>
						<Grid item gap={2}>
							<Typography sx={{ fontWeight: 250 }} variant='h3' color='white'>Customers</Typography>
							<Typography sx={{ fontWeight: 300 }} variant='h3' color='white'>[ {customers.length} ]</Typography>
						</Grid>
						<Grid item gap={2}>
							<Typography sx={{ fontWeight: 250 }} variant='h3' color='white'>Products</Typography>
							<Typography sx={{ fontWeight: 300 }} variant='h3' color='white'>[ {products.length} ]</Typography>
						</Grid>
					</Grid>
				</CardWrapper>
			)}
		</>
	);
};

TotalSalesCard.propTypes = {
	isLoading: PropTypes.bool
};

export default TotalSalesCard;
