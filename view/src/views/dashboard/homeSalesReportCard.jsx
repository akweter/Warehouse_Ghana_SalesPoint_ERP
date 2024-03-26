import PropTypes from 'prop-types';
import { 
	Box, 
	Grid, 
	List, 
	Typography,
} from '@mui/material';
import SkeletonEarningCard from '../../ui-component/cards/Skeleton/EarningCard';
import { CardWrapper, CustomLLogo } from 'ui-component/colorsCardWrapper';
import product from '../../assets/images/icons/product.png';
import customer from '../../assets/images/icons/customers.png'

const TotalSalesCard = ({ isLoading, customers, products }) => {
	return (
		<>
			{isLoading ? (
				<SkeletonEarningCard />
			) : (
				<CardWrapper theme={'#2238A2'}>
					<Grid container textAlign='center' flexDirection='column-reverse'>
						<Grid item>
							<Grid container>
								<Grid item>
									<Box sx={{ p: 1 }}>	
										<List sx={{ py: 0 }}>
											<CustomLLogo
												border={0}
												avatarIcon={customer}
											/>
										</List>
									</Box>
								</Grid>
								<Grid item>
									<Typography sx={{ fontWeight: 250 }} color="#7008AF" variant='h3'>Customers</Typography>
									<Typography sx={{ fontWeight: 300 }} color="gold" variant='h3'>[ {customers.length} ]</Typography>
								</Grid>
							</Grid>
						</Grid>
						<Grid item borderTop='3px dashed gold'>
							<Grid container>
								<Grid item>
									<Box sx={{ p: 1 }}>	
										<List sx={{ py: 0 }}>
											<CustomLLogo
												border={0}
												avatarIcon={product}
											/>
										</List>
									</Box>
								</Grid>
								<Grid item>
									<Typography sx={{ fontWeight: 250 }} color="#7008AF" variant='h3'>Products</Typography>
									<Typography sx={{ fontWeight: 300 }} color="gold" variant='h3'>[ {products.length} ]</Typography>
								</Grid>
							</Grid>
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
