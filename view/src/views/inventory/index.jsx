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
import { fetchAllSupplier } from 'apiActions/allApiCalls/supplier';
import { fetchAllUsers } from 'apiActions/allApiCalls/users';

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
            const users = await fetchAllUsers();
            const suppliers = await fetchAllSupplier();
            const updatedProductsWithUsers = products.map(product => {
                const user = users.find(user => user.Usr_id === product.Itm_usr_id);
                if (user) {
                    product.Itm_usr_id = user.Usr_name;
                }
                return product;
            });
            const updatedProductsWithSuppliers = updatedProductsWithUsers.map(product => {
                const supplier = suppliers.find(supplier => supplier.SnC_id === product.Itm_SnC_id);
                if (supplier) {
                    product.Itm_SnC_id = supplier.SnC_name;
                }
                return product;
            });
            setProducts(updatedProductsWithSuppliers);
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
                <InventoryProductsTable products={products} loading={loading} />
            </Box>
            <UploadCSVProducts openDialog={open} CloseDialog={handleClose} RefreshData={setSubmitted} />
        </>
    );
}

export default Inventory;
