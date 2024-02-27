import React, { useState, useEffect } from 'react';
import {
    Grid,
    Box,
    Paper,
    Toolbar,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
} from '@mui/material';

// Projects
import WooOrders from './orders/order';
import WooCustomers from './customers/customer';
import WooProducts from './products/product';
import WooAnalysis from './analysis/analysis';
import {
    FetchWooSearchCustomer,
    FetchWooSearchOrder,
    FetchWooSearchProduct
} from 'apiActions/allApiCalls/woocommerce';
import {
    MasonryContainer,
    MasonryItem,
    ResultItem,
    ResultsContainer,
    Search,
    SearchIconWrapper,
    StyledInputBase
} from 'ui-component/styleEffects';
import { SearchSharp } from '@mui/icons-material';
import { GeneralCatchError } from 'utilities/errorAlert';

const Analysis = () => <WooAnalysis />;
const Orders = () => <WooOrders />;
const Customers = () => <WooCustomers />;
const Products = () => <WooProducts />;

const components = [Orders, Customers, Products, Analysis];

const WoocommerceApi = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [definition, setDefinition] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [open, setOpen] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setLoading(true);
    };

    const handleDefinitionChange = (event) => {
        setDefinition(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (definition && searchTerm) {
                    switch (definition) {
                        case 'Product':
                            const response = await FetchWooSearchProduct(searchTerm);
                            setResults(response);
                            break;
                        case 'Customer':
                            const info = await FetchWooSearchCustomer(searchTerm);
                            setResults(info);
                            break;
                        case 'Order':
                            const data = await FetchWooSearchOrder(searchTerm);
                            setResults(data);
                        default:
                            setResults([]);
                            break;
                    }
                }
            }
            catch (error) {
                setTimeout(() => {
                    setResults([]);
                    setOpen(true);
                    setAlert((e) => ({ ...e, message: `Something unexpected happened with\n your connection. \n\n Please log in again if it persist.`, color: 'error' }));
                    setLoading(false);
                }, 1500);
            }
            finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [definition, searchTerm]);

    const handleClose = (event, reason) => { if (reason === 'clickaway') { return; } setOpen(false) };

    return (
        <>
            {
                alert.message ?
                    <GeneralCatchError alert={alert} handleClose={handleClose} open={open} /> :
                    null
            }
            <Box sx={{ flexGrow: 5 }}>
                <Toolbar
                    sx={{
                        justifyContent: 'space-evenly',
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <Typography
                        variant="h4"
                        noWrap
                        component="header"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                        color="darkred"
                    >
                        WOOCOMMERCE ONLINE STORE
                    </Typography>
                    <Search
                        sx={{
                            justifyContent: 'space-around',
                            display: 'flex',
                            flexDirection: 'row',
                        }}
                    >
                        <Box sx={{ width: '100%' }}>
                            <FormControl fullWidth>
                                <InputLabel id="Definition">Search Term</InputLabel>
                                <Select
                                    required
                                    name="Definition"
                                    size="small"
                                    value={definition}
                                    onChange={handleDefinitionChange}
                                >
                                    {/* <MenuItem value="">Clear</MenuItem> */}
                                    <MenuItem value="Order">Order</MenuItem>
                                    <MenuItem value="Customer">Customer</MenuItem>
                                    <MenuItem value="Product">Product</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <SearchIconWrapper>
                                {loading ? (
                                    <CircularProgress color="primary" size={18} />
                                ) : (
                                    < SearchSharp color="primary" />
                                )}
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                disabled={definition === '' ? true : false}
                            />
                        </Box>
                    </Search>
                </Toolbar>
                <Paper sx={{ backgroundColor: 'white', width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                </Paper>
                <Grid container spacing={2}>
                    <MasonryContainer>
                        {components.map((Component, index) => (
                            <MasonryItem key={index}>
                                <Component />
                            </MasonryItem>
                        ))}
                    </MasonryContainer>
                </Grid>
                <ResultsContainer>
                    {
                        results.length > 0 && (
                            results.map((result, index) => (
                                <ResultItem key={index}>
                                    <Typography variant="body1">{result.name}</Typography>
                                </ResultItem>
                            ))
                        )
                    }
                </ResultsContainer>
            </Box>
        </>
    );
};

export default WoocommerceApi;
