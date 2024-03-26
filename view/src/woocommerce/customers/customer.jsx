import { fetchAllWooCustomers } from 'apiActions/allApiCalls/woocommerce';
import React, { useEffect, useState } from 'react';
import CustomersTable from './customersTable';
import ProductPlaceholder from 'ui-component/cards/Skeleton/ProductPlaceholder';
const { Typography } = require("@mui/material")

const WooCustomers = () => {
    const [customers, setCustomers] = useState([]);
    
    useEffect(()=>{
        const fetData = async () =>{
            try {
                const data = await fetchAllWooCustomers();
                setCustomers(data);
            }
            catch (error) {
                return null;
            }
        }
        fetData();
    }, []);

    return(
        <>
            <Typography variant="h4" align="center" color='darkred'>Customers</Typography>
            {
                customers.length > 0 ?
                < CustomersTable data={customers}/> : 
                < ProductPlaceholder />
            }
        </>
    )
}

export default WooCustomers;