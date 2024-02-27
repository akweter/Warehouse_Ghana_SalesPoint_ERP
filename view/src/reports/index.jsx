import { Box, Card, Grid } from '@mui/material';
import SubCard from '../ui-component/cards/SubCard';

const Tools = () => (
    <Grid container>
      <Grid item xs={12}>
        <SubCard>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ mb: 3, boxShadow: 5 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                py: 4.5,
                                bgcolor: 'lightgray',
                                color: 'red'
                            }}
                        >
                            Here I am to dance
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ mb: 3, boxShadow: 5 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                py: 4.5,
                                bgcolor: 'lightgray',
                                color: 'red'
                            }}
                        >
                            Here I am to dance
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Card sx={{ mb: 3, boxShadow: 5 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            py: 4.5,
                            bgcolor: 'lightgray',
                            color: 'red'
                        }}
                    >
                        Here I am to dance
                    </Box>
                </Card>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ mb: 3, boxShadow: 5 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                py: 4.5,
                                bgcolor: 'lightgray',
                                color: 'red'
                            }}
                        >
                            Here I am to dance
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card sx={{ mb: 3, boxShadow: 5 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                py: 4.5,
                                bgcolor: 'lightgray',
                                color: 'red'
                            }}
                        >
                            Here I am to dance
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </SubCard>
      </Grid>
    </Grid>
);

export default Tools;
