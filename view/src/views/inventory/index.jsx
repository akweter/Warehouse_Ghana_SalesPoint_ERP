import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Grid,
} from "@mui/material";

// Projects
import UploadCSVProducts from "./uploadProducts";
import InventoryProductsTable from './displayProducts';
import { fetchAllProducts } from 'apiActions/allApiCalls/product';

const Inventory = () => {
    const [submitted, setSubmitted] = useState(false);
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => { setOpen(true) }
    const handleClose = () => { setOpen(false) }

    useEffect(() => {
        fetchData();
    }, [submitted]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const products = await fetchAllProducts();
            setProducts(products);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
        catch (error) {
            setLoading(true);
        }
    }

    return (
        <>
            <Grid container sx={{ justifyContent: 'space-around' }}>
                <Button
                    variant='contained'
                    color='primary'
                    size='medium'
                    sx={{ color: 'gold' }}
                    onClick={handleOpen}
                >
                    Add New Product
                </Button>
            </Grid>
            <Box>
                <InventoryProductsTable products={products} loading={loading} RefreshData={setSubmitted}/>
            </Box>
            <UploadCSVProducts openDialog={open} CloseDialog={handleClose} RefreshData={setSubmitted} />
        </>
    );
}

export default Inventory;
