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
import { PostNewProducts } from '../../apiActions/allApiCalls/product';

const NewProductForm = ({products}) => {
    const [data, setData] = useState([]);
    
    const handleEdit = (index) => {
        // Implement your edit logic here
    };

    const submitProducts = async () => {
        try {
        const response = await PostNewProducts(data);
        } catch (error) {
            return null;
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
                                    <TableCell>{product.productName}</TableCell>
                                    <TableCell>{product.stockQTY}</TableCell>
                                    <TableCell>{product.unitPrice}</TableCell>
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
