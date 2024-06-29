import { fetchAllWooOrders } from '../../apiActions/allApiCalls/woocommerce';
import OrdersTable from './ordersTable';
import ProductPlaceholder from '../../ui-component/cards/Skeleton/ProductPlaceholder';

import React, { useEffect, useState } from 'react';
const { Typography } = require("@mui/material")

const WooOrders = () => {
    const [orders, setOrders] = useState([]);
    
    useEffect(()=>{
        fetchAllWooOrders()
        .then((data) => {
            setOrders(data);
        })
        .catch(() => {
            return null;
        });
    }, []);

    return(
        <>
            <Typography variant="h4" align="center" color='darkred'>Orders</Typography>
            {
                orders.length > 0 ? 
                < OrdersTable orders={orders}/> : 
                < ProductPlaceholder />
            }
        </>
    )
}

export default WooOrders;