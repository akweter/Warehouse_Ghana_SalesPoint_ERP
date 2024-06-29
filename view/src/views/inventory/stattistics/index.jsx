import React, { useState, useEffect } from 'react';
import { 
    Paper,
    Stack,
    Typography,
    Box,
    IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close } from '@mui/icons-material';
import { MasonryContainer, MasonryItem } from '../../../ui-component/styleEffects';
import TopPerformingProducts from './topPerformingProducts';
import Two from './two';
import Three from './three';
import Four from './four';

/* eslint-disable */
const DemoPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
    width: '100%'
}));

const Analysis = () => <TopPerformingProducts />;
const Orders = () => <Two />;
const Customers = () => <Three />;
const Products = () => <Four />;
const components = [Orders, Customers, Products, Analysis];

const ProductStats = ({ closeDrawer }) => {
    const [show, setShow] = useState([]);
    const [data, setData] = useState([]);
    const [alert, setAlert]= useState({message: '', color: 'success'});

    useEffect(() => {}, []);
    
    return (
        <Stack direction="row" overflow='scroll' width={1250} margin={1} border='2px solid blue' borderRadius={5}>
            <DemoPaper variant="outlined">
                <Typography variant='h3' sx={{ backgroundColor: 'darkblue' }} color='white' align='center'>
                    Product Statistics <IconButton color='primary' onClick={closeDrawer}><Close color='error'/></IconButton>
                </Typography>
                <Box sx={{ height: 600, width: '100%' }}>
                    <MasonryContainer>
                        {components.map((Component, index) => (
                            <MasonryItem key={index}>
                                <Component />
                            </MasonryItem>
                        ))}
                    </MasonryContainer>
                </Box>
            </DemoPaper>
        </Stack>
    );
};

export default ProductStats;
