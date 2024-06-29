import React, { useState } from 'react';
import {
    Typography,
    Box,
    Button,
    DialogContent,
    DialogActions,
    Grid,
    FormControl,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Slider,
    CircularProgress,
} from '@mui/material';
import { ShowBackDrop } from '../../utilities/backdrop';
import { AlertError } from '../../utilities/errorAlert';
import { updateWooProducts } from '../../apiActions/allApiCalls/woocommerce';

/* eslint-disable */

const UpdateWooProduct = ({ product, openClose, fetchPRoducts }) => {
    const [formData, setFormData] = useState({
        price: product.price || '',
        name: product.name || '',
        id: product.id || '',
        short_description: product.short_description || '',
        sku: product.sku || '',
        price_html: product.price_html || '',
        shipping_class: product.shipping_class || '',
        stock_status: product.stock_status || '',
    });
    const [drop, setDrop] = useState(false);
    const [alert, setAlert] = useState({ message: '', color: '' });
    const [openAlert, setOpenAlert] = useState(false);

    // Change product change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Submit form to backend
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setDrop(true);
            updateWooProducts(formData.id, formData)
                .then(() => {
                    fetchPRoducts();
                    setTimeout(() => {
                        setAlert({ message: `${formData.name || " Product"} updated successfully`, color: 'success' });
                        setOpenAlert(true);

                        setTimeout(() => {
                            openClose(false);
                            setFormData((e) => ({
                                ...e,
                                price: '',
                                name: '',
                                id: '',
                                short_description: '',
                                sku: '',
                                shipping_class: '',
                            }));
                            setDrop(true);
                        }, 1000);
                    }, 2000);
                })
                .catch(() => {
                    setDrop(false);
                    setAlert({ message: 'failed!', color: 'error' });
                })
        }
        catch (error) {
            setDrop(false);
            setAlert({
                message: 'Something bad happened!',
                color: 'error',
            });
        }
    };

    return (
        <>
            {alert.message ? (<AlertError open={openAlert} alert={alert} />) : null}
            {drop ? <ShowBackDrop open={drop} /> : null}
            <DialogContent>
                <Box>
                    <Typography variant='h4' color="darkred" align='center' paddingBottom={2}>
                       Editting <i style={{color: 'darkblue'}}>{formData.name ? formData.name : formData.name}</i>
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Product Name"
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel>Stock Status</InputLabel>
                                <Select
                                    name="stock_status"
                                    required
                                    value={formData.stock_status}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="instock">Available</MenuItem>
                                    <MenuItem value="outofstock">Out Stocked</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                    <TextField
                                        label="Product SKU"
                                        required
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                    />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Product Price"
                                    required
                                    name="price"
                                    type='number'
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel>Shipping Class</InputLabel>
                                <Select
                                    name="shipping_class"
                                    required
                                    value={formData.shipping_class}
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="">None</MenuItem>
                                    <MenuItem value="extra-small">X-Small</MenuItem>
                                    <MenuItem value="small">Small</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="large">Large</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <textarea rows={5} cols={5}
                                label="Tag List Prices"
                                required
                                name="price_html"
                                value={formData.price_html}
                                onChange={handleInputChange}/>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <textarea rows={15} cols={5}
                                label="Short Description"
                                required
                                name="short_description"
                                value={formData.short_description}
                                onChange={handleInputChange}/>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => openClose(false)} variant='outlined' color='error'>Cancel</Button>
                <Button onClick={handleFormSubmit} variant='outlined' color='primary'>{drop ? <CircularProgress open={drop} size='25px' /> : 'Update'}</Button>
            </DialogActions>
        </>
    );
}

export default UpdateWooProduct;