import { Grid, Typography } from '@mui/material';

const GridLayout = ({title, children}) => (
    <div>
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <Typography variant='h2'>{title}</Typography>
                <Grid container spacing={1}>
                    {children}
                </Grid>
            </Grid>
        </Grid>
    </div>
);

export default GridLayout;
