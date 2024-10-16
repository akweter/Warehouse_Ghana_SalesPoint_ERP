import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    Grid,
    Paper,
    Typography,
} from "@mui/material";

// /* eslint-disable */

// Projects
import { fetchAllCustomersNSuppliers } from '../../apiActions/allApiCalls/customer';
import CustomersSuppliersTable from './displayCustomers';
import { LoadingSpinner } from '../../ui-component/loaderAPI';
import AddSupnCustomers from './addCustomers';
import VerifyTIN from './verifyTIN';
import ProductPlaceholder from '../../ui-component/cards/Skeleton/ProductPlaceholder';

const CusNSupp = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [customersNsuppliers, setcustomersNsuppliers] = useState([]);

    const handleOpen = () => { setOpen(true) }
    const handleClose = () => { setOpen(false) }

    useEffect(() => {
        fetchData();
    }, [submitted]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const customersNSuppliers = await fetchAllCustomersNSuppliers();
            setTimeout(() => {
                setcustomersNsuppliers(customersNSuppliers);
                setLoading(false);
            }, 1500);
        }
        catch (error) {
            setTimeout(() => {
                setLoading(false);
            }, 5000);
        }
    }

    return (<>
        <Paper>
            <Grid container sx={{ justifyContent: 'space-around', paddingBottom: 1, backgroundColor: 'darkblue', padding: 1, }}>
                <Typography color='white' variant='h3'>Customers Management Page</Typography>
                <VerifyTIN />
                <Button
                    variant='contained'
                    color='inherit'
                    size='medium'
                    onClick={handleOpen}
                >
                    Add New User
                </Button>
            </Grid>
            <Box>
                {loading ?  <LoadingSpinner /> : <>
                    {
                        customersNsuppliers.length > 0 ?
                        <CustomersSuppliersTable inData={customersNsuppliers} setSubmitted={setSubmitted} />
                        : <ProductPlaceholder />
                    }
                </>}
            </Box>
        </Paper>
        <Dialog open={open}>
            <AddSupnCustomers closeAddnewUser={handleClose} setSubmitted={setSubmitted} />
        </Dialog>
    </>);
}

export default CusNSupp;
