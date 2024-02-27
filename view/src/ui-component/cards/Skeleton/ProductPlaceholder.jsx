// material-ui
import { Box, CardContent, Grid, Paper, Skeleton, Stack } from '@mui/material';

// project import
import MainCard from '../MainCard';

// ===========================|| SKELETON TOTAL GROWTH BAR CHART ||=========================== //

const ProductPlaceholder = () => (
	<MainCard content={false} boxShadow>
		<Box padding={2} width='100%'>
			<Skeleton variant="rectangular" height={150} animation='wave'/>
			<CardContent sx={{ pt: 1 }}>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<Skeleton variant="rectangular" height={20} animation='wave'/>
					</Grid>
					<Grid item xs={12}>
						<Skeleton variant="rectangular" height={20} animation='wave'/>
					</Grid>
				</Grid>
			</CardContent>
		</Box>
	</MainCard>
);

export default ProductPlaceholder;
