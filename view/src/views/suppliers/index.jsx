import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Button,
} from "@mui/material";

// /* eslint-disable */

// Projects
import SuppliersTable from './displaySupplier';
import { LoadingSpinner } from '../../ui-component/loaderAPI';
import { fetchAllSupplier } from '../../apiActions/allApiCalls/supplier';

const CusNSupp = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customersNsuppliers, setcustomersNsuppliers] = useState([]);

    useEffect(() => {
        fetchData();
    }, [submitted]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const customersNSuppliers = await fetchAllSupplier();
            setTimeout(() => {
                setcustomersNsuppliers(customersNSuppliers);
                setLoading(false);
            }, 1000);
        }
        catch (error) {
            return;
        }
                setLoading(false);
    }

    return (
        <>
            {
                loading ?
                <LoadingSpinner /> :
                <>
                    {
                        customersNsuppliers.length > 0 ? (<>
                            <Paper>
                                <Grid container sx={{ justifyContent: 'space-around', paddingBottom: 1, backgroundColor: 'darkblue', padding: 1, }}>
                                    <Typography color='white' variant='h3'>Suppliers Portal</Typography>
                                    <Button
                                        variant='contained'
                                        color='inherit'
                                        size='medium'
                                        onClick={()=>window.alert('Coming soon!')}
                                    >
                                        Upload Suppliers
                                    </Button>
                                </Grid>
                                <Box>
                                    < SuppliersTable inData={customersNsuppliers} setSubmitted={setSubmitted} />
                                </Box>
                            </Paper>
                        </>) :
                            null
                    }
                </>
            }
        </>
    );
}

export default CusNSupp;
