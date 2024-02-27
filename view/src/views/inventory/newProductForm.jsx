import React, { useState } from 'react';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Paper,
} from '@mui/material';
import { PostNewProducts } from 'apiActions/allApiCalls/product';

const NewProductForm = ({products}) => {
    const [data, setData] = useState([]);
    
    const handleEdit = (index) => {
        // Implement your edit logic here
        console.log('Edit product:', products[index]);
    };

    const submitProducts = async () => {
        try {
        const response = await PostNewProducts(data);
        console.log(response.data);
        } catch (error) {
        console.log('Error uploading data:', error);
        }
    };

    return(
        <div>
        {
            Array.isArray(products) && (products.length > 0) ?
                (products.map((product, index) => (<>
                    <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow key={index}>
                                    <TableCell>{product.Itm_name}</TableCell>
                                    <TableCell>{product.Itm_qty}</TableCell>
                                    <TableCell>{product.Itm_price}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="primary" onClick={() => handleEdit(index)}>
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button variant='outlined' color='primary' size='large' onClick={submitProducts} style={{ marginTop: '20px' }}>
                        Submit
                    </Button>
                </>))) :
                null
            }
        </div>
    );
}

export default NewProductForm;
