import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
} from "@mui/material";

// /* eslint-disable */

// Projects
import { fetchAllCustomersNSuppliers } from '../../apiActions/allApiCalls/customer';
import CustomersSuppliersTable from './displayCustomers';
import { LoadingSpinner } from '../../ui-component/loaderAPI';
import VerifyTIN from './verifyTIN';
import ProductPlaceholder from '../../ui-component/cards/Skeleton/ProductPlaceholder';
import UploadCustomers from './uploadCustomers';

const CusNSupp = () => {
    const [loading, setLoading] = useState(false);
    const [customersNsuppliers, setcustomersNsuppliers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

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
                <UploadCustomers />
            </Grid>
            <Box>
                {loading ?  <LoadingSpinner /> : <>
                    {
                        customersNsuppliers.length > 0 ?
                        <CustomersSuppliersTable 
                            inData={customersNsuppliers} 
                            setSubmitted={fetchData} 
                            />
                        : <ProductPlaceholder />
                    }
                </>}
            </Box>
        </Paper>
    </>);
}

export default CusNSupp;
