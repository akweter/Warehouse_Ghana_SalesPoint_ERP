// /* eslint-disable */

import React, { useState, useEffect } from 'react';
import {
    Button,
    Box,
    Grid,
    List,
    ListItem,
    ListItemText,
    Typography,
    ListSubheader,
    ListItemIcon,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    ExpandMore
} from '@mui/icons-material'
import { IconArrowBarToDown, IconArrowBarToUp, IconCircleNumber0, IconListCheck, IconShoppingBag } from '@tabler/icons';


// Projects
import UploadCSVProducts from "./uploadProducts";
import InventoryProductsTable from './displayProducts';
import { fetchAllProducts, fetchDashboardCardDetails } from '../../apiActions/allApiCalls/product';
import { LoadingSpinner } from '../../ui-component/loaderAPI';

const Inventory = () => {
    const [submitted, setSubmitted] = useState(false);
    const [open, setOpen] = useState(false);
    const [totlalStock, setTotlalStock] = useState([]);
    const [topPerforming, setTopPerforming] = useState([]);
    // const [itemLine, setItemLine] = useState([]); It contains the list of bought items in the month and quantity.
    const [zeroStock, setZeroStock] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => { setOpen(true) }
    const handleClose = () => { setOpen(false) }

    useEffect(() => {
        fetchData();
        dashboardDetails();
    }, [submitted]);

    // Fetch datagrid details
    const fetchData = async () => {
        setLoading(true);
        try {
            const products = await fetchAllProducts();
            setProducts(products);
        }
        catch (error) {
            return;
        }
        setLoading(false);
    }

    // Card details
    const dashboardDetails = async () => {
        try {
            const productDetails = await fetchDashboardCardDetails();
            setTotlalStock(productDetails[0]);
            setLowStock(productDetails[1]);
            // setItemLine(productDetails[2]);
            setTopPerforming(productDetails[3]);
            setZeroStock(productDetails[4]);
        } catch (error) {
            setTotlalStock([]);
            setLowStock([]);
            // setItemLine([]);
            setTopPerforming([]);
            setZeroStock([]);
        }
    }

    const colorType = (color) => {
        return {
            background: color,
            height: 10,
            marginRight: 10,
            marginLeft: 10,
            borderRadius: 40,
        }
    }
    return (
        <>
            <Grid container sx={{ justifyContent: 'space-around', backgroundColor: 'darkblue', paddingTop: 1, paddingBottom: 1, }}>
                <Typography color='white' variant='h3'>Inventory | Stock Management</Typography>
                <Button
                    variant='contained'
                    color='inherit'
                    size='large'
                    onClick={handleOpen}
                >
                    <Typography variant='h5' color='darkred'>Add New Product</Typography>
                </Button>
            </Grid>

            <div>
                <Accordion sx={{ backgroundColor: '#e2e6f9' }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography sx={{ width: '33%', flexShrink: 0 }}></Typography>
                        <Typography sx={{ color: 'text.secondary', fontWeight: 600 }}>Click here to view the status of your stock</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={1} mb={2}>
                            <Grid item xs={6} sm={4} md={2}>
                                <Paper sx={{ cursor: 'pointer' }}>
                                    <List
                                        subheader={<ListSubheader>Total Stock</ListSubheader>}>
                                        <ListItem>
                                            <ListItemIcon>
                                                <IconShoppingBag color='#172094' />
                                            </ListItemIcon>
                                            <ListItemText primary={totlalStock && totlalStock.length > 0 ? totlalStock[0].TotalStock : 0} />
                                        </ListItem>
                                    </List>
                                    <div style={colorType('darkblue')} />
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={4} md={2.5}>
                                <Paper sx={{ cursor: 'pointer', }}>
                                    <List subheader={<ListSubheader>Top Perfoming</ListSubheader>}>
                                        <ListItem>
                                            <ListItemIcon>
                                                <IconArrowBarToUp color='#14A437' />
                                            </ListItemIcon>
                                            <ListItemText primary={topPerforming && topPerforming.length > 0 ? topPerforming.length : 0} />
                                        </ListItem>
                                    </List>
                                    <div style={colorType('green')} />
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={4} md={2.5}>
                                <Paper sx={{ cursor: 'pointer', }}>
                                    <List subheader={<ListSubheader>Items List</ListSubheader>}>
                                        <ListItem>
                                            <ListItemIcon>
                                                <IconListCheck color='#BFCA0C' />
                                            </ListItemIcon>
                                            <ListItemText primary={products && products.length} />
                                        </ListItem>
                                    </List>
                                    <div style={colorType('yellow')} />
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={4} md={2.5}>
                                <Paper sx={{ cursor: 'pointer', }}>
                                    <List subheader={<ListSubheader>Zero Stock</ListSubheader>}>
                                        <ListItem>
                                            <ListItemIcon>
                                                <IconCircleNumber0 color='#E13209' />
                                            </ListItemIcon>
                                            <ListItemText primary={zeroStock &&zeroStock.length > 0 ? zeroStock.length : 0} />
                                        </ListItem>
                                    </List>
                                    <div style={colorType('red')} />
                                </Paper>
                            </Grid>
                            <Grid item xs={6} sm={4} md={2.5}>
                                <Paper sx={{ cursor: 'pointer', }}>
                                    <List subheader={<ListSubheader>Low Stock</ListSubheader>}>
                                        <ListItem>
                                            <ListItemIcon>
                                                <IconArrowBarToDown color='#872222' />
                                            </ListItemIcon>
                                            <ListItemText primary={lowStock && lowStock.length > 0 ? lowStock.length : 0} />
                                        </ListItem>
                                    </List>
                                    <div style={colorType('brown')} />
                                </Paper>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </div>

            <Box>
                {products.length > 0 ?
                    <InventoryProductsTable
                        products={products}
                        loading={loading}
                    /> 
                : < LoadingSpinner />}
            </Box>
            <UploadCSVProducts
                openDialog={open}
                CloseDialog={handleClose}
                refreshPage={() => setSubmitted(prev => !prev)}
            />
        </>
    );
}

export default Inventory;
