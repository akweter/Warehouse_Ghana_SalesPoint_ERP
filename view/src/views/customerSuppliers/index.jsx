import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Grid,
	Paper,
} from "@mui/material";

// Projects
import { fetchAllCustomersNSuppliers } from 'apiActions/allApiCalls/customer';
import CustomersSuppliersTable from './displayCusNSup';

const CusNSupp = () => {
    const [submitted, setSubmitted] = useState(false);
    const [open, setOpen] = useState(false);
    const [customersNsuppliers, setcustomersNsuppliers] = useState([]);

    const handleOpen = () => { setOpen(true) }
    const handleClose = () => { setOpen(false) }

    useEffect(() => {
        fetchData();
    }, [submitted]);

    const fetchData = async () => {
        try {
            const customersNSuppliers = await fetchAllCustomersNSuppliers();
            setcustomersNsuppliers(customersNSuppliers);

            // setTimeout(() => {
            //     // Update Itm_usr_id with User Names
            //     const updatedcustomersWithUsers = customers.map(product => {
            //         const user = users.find(user => user.Usr_id === product.Itm_usr_id);
            //         if (user) {
            //             product.Itm_usr_id = user.Usr_name;
            //         }
            //         return product;
            //     });
            //     const updatedSuppliersWithUsers = suppliers.map(product => {
            //         const user = users.find(user => user.Usr_id === product.Itm_usr_id);
            //         if (user) {
            //             product.Itm_usr_id = user.Usr_name;
            //         }
            //         return product;
            //     });

            //     // Update Itm_sup_id with Supplier Names
            //     const updatedcustomersWithSuppliers = updatedcustomersWithUsers.map(product => {
            //         const supplier = suppliers.find(supplier => supplier.Sup_id === product.Itm_sup_id);
            //         if (supplier) {
            //             product.Itm_sup_id = supplier.Sup_name;
            //         }
            //         return product;
            //     });
            //     setCustomers(updatedcustomersWithSuppliers);
            // }, 500);

        }
        catch (error) {
        }
    }

    return (
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
				{
					customersNsuppliers.length > 0 ? (
						< CustomersSuppliersTable inData={customersNsuppliers}/>
					) : 
					null
				}
            </Box>
            {/*< UploadCSVcustomers openDialog={open} CloseDialog={handleClose} setSubmiited={setSubmitted}/> */}
        </Paper>
    );
}

export default CusNSupp;
