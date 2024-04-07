import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    Grid,
    Paper,
} from "@mui/material";

/* eslint-disable */

// Projects
import { fetchAllCustomersNSuppliers } from 'apiActions/allApiCalls/customer';
import CustomersSuppliersTable from './displayCusNSup';
import { LoadingSpinner } from 'ui-component/loaderAPI';
import AddSupnCustomers from './addSupCustomers';

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

    return (
        <>
            {
                loading ?
                <LoadingSpinner /> :
                <>
                    {
                        customersNsuppliers.length > 0 ? (<>
                            <Paper>
                                <Grid container sx={{ justifyContent: 'space-around', paddingBottom: 1 }}>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        size='medium'
                                        onClick={handleOpen}
                                    >
                                        Add New User
                                    </Button>
                                </Grid>
                                <Box>
                                    < CustomersSuppliersTable inData={customersNsuppliers} setSubmitted={setSubmitted} />
                                </Box>
                            </Paper>
                            <Dialog open={open}>
                                <AddSupnCustomers closeAddnewUser={handleClose} setSubmitted={setSubmitted} />
                            </Dialog>
                        </>) :
                            null
                    }
                </>
            }
        </>
    );
}

export default CusNSupp;
