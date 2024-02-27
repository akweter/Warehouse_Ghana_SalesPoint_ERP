import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Grid,
} from "@mui/material";

// Projects
import UploadCSVProducts from "./uploadProducts";
import ProductPlaceholder from 'ui-component/cards/Skeleton/ProductPlaceholder';
import InventoryProductsTable from './displayProducts';
import { fetchAllProducts } from 'apiActions/allApiCalls/product';
import { fetchAllSupplier } from 'apiActions/allApiCalls/supplier';
import { fetchAllUsers } from 'apiActions/allApiCalls/users';


const Inventory = () => {
    const [submitted, setSubmitted] = useState(false);
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState([]);

    const handleOpen = () => { setOpen(true) }
    const handleClose = () => { setOpen(false) }

    useEffect(() => {
        const fetchData = async () => {
            try {
                // fetch products
                const products = await fetchAllProducts();

                // fetch users
                const users = await fetchAllUsers();

                // fetch suppliers
                const suppliers = await fetchAllSupplier();

                setTimeout(() => {
                    // Update Itm_usr_id with User Names
                    const updatedProductsWithUsers = products.map(product => {
                        const user = users.find(user => user.Usr_id === product.Itm_usr_id);
                        if (user) {
                            product.Itm_usr_id = user.Usr_name;
                        }
                        return product;
                    });

                    // Update Itm_SnC_id with Supplier Names
                    const updatedProductsWithSuppliers = updatedProductsWithUsers.map(product => {
                        const supplier = suppliers.find(supplier => supplier.SnC_id === product.Itm_SnC_id);
                        if (supplier) {
                            product.Itm_SnC_id = supplier.SnC_name;
                        }
                        return product;
                    });
                    setProducts(updatedProductsWithSuppliers);
                }, 500);

            }
            catch (error) {
                // setLoading(false);
                setProducts([]);
            }
        }
        fetchData();
    }, [submitted]);

    return (
        <div>
            <Grid container sx={{ justifyContent: 'space-around' }}>
                <Button
                    variant='contained'
                    color='primary'
                    size='medium'
                    sx={{color: 'gold'}} 
                    onClick={handleOpen}
                >
                    Add New Product
                </Button>
            </Grid>
            <Box>
                {
                    products.length > 0 || submitted ?
                        < InventoryProductsTable products={products} /> :
                        < ProductPlaceholder />
                }
            </Box>
            < UploadCSVProducts openDialog={open} CloseDialog={handleClose} setSubmiited={setSubmitted}/>
        </div>
    );
}

export default Inventory;
