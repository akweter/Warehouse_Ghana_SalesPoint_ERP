import React, { useEffect, useState } from 'react';
import { fetchAllWooProducts } from '../../apiActions/allApiCalls/woocommerce';
import ProductsTable from './productsTable';
import ProductPlaceholder from '../../ui-component/cards/Skeleton/ProductPlaceholder';
const {
    Typography
} = require("@mui/material");

const WooProducts = () => {
    const [products, setProducts] = useState([]);
    
    useEffect(()=>{
        fetchPRoduct();
    }, []);

    const fetchPRoduct = () => {
        fetchAllWooProducts()
        .then((data) => {
            setProducts(data);
        })
        .catch(() => {
            return null;
        })
    }

    return(
        <>
            <Typography variant="h4" align="center" color='darkred'>Products</Typography>
            {
                products.length > 0 ?
                < ProductsTable products={products} fetchPRoducts={fetchPRoduct}/> :
                < ProductPlaceholder />
            }
        </>
    )
}

export default WooProducts;