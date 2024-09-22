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
import SuppliersTable from './displaySupplier';
import { LoadingSpinner } from '../../ui-component/loaderAPI';
import { fetchAllSupplier } from '../../apiActions/allApiCalls/supplier';
import AddSupplier from './addSupplier';

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
            const customersNSuppliers = await fetchAllSupplier();
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
                                <Grid container sx={{ justifyContent: 'space-around', paddingBottom: 1, backgroundColor: 'darkblue', padding: 1, }}>
                                    <Typography color='white' variant='h3'>Suppliers Portal</Typography>
                                    <Button
                                        variant='contained'
                                        color='inherit'
                                        size='medium'
                                        onClick={handleOpen}
                                    >
                                        Add New Supplier
                                    </Button>
                                </Grid>
                                <Box>
                                    < SuppliersTable inData={customersNsuppliers} setSubmitted={setSubmitted} />
                                </Box>
                            </Paper>
                            <Dialog open={open}>
                                <AddSupplier closeAddnewUser={handleClose} setSubmitted={setSubmitted} />
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
