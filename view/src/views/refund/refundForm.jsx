import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography
} from '@mui/material';
import { headerPayload, itemlistPayload } from 'views/payload/payloadStructure';
import { computeFinalRefTaxes, } from 'utilities/computeAllTaxes';
import { AlertError } from 'utilities/errorAlert';
import { ShowBackDrop } from 'utilities/backdrop';
import { getUserName } from 'utilities/getUserName';
import { Cancel } from '@mui/icons-material';
import { postRefundInvoice } from 'apiActions/allApiCalls/refund';

/* eslint-disable */
const RefundForms = ({ open, handleClose, refundInv, setSubmitted }) => {
    const [openAlert, setOpen] = useState(false);
    const [drop, setDrop] = useState(false);
    const [itemLists, setItemLists] = useState(itemlistPayload);
    const [header, setHeader] = useState(headerPayload);
    const [currentQuantities, setCurrentQuantities] = useState({});
    const [originalQuantities, setOriginalQuantities] = useState({});
    const [quantityErrors, setQuantityErrors] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [alert, setAlert] = useState({ message: '', color: '' });

    // Generate random number for refund reference
    function generateRandomNumber() {
        const length = 10;
        const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
        return randomNumber.toString().padStart(length, '0');
    }

    // Set Date value according to GRA API standard
    const formatDate = (date) => {
        if (date) {
            const parts = date.split('/');
            const formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            return formattedDate;
        }
    }    

    // update the header and item state
    useEffect(() => {
        if (refundInv) {
            const {
                CustomerTIN,
                InvoiceNumber,
                ExchangeRate,
                Currency,
                CalculationType,
                CustomerName,
                products,
                Remarks,
                SaleType,
                DiscountType,
                InvoiceDate,
            } = refundInv;

            // Set header state
            setHeader((state) => ({
                ...state,
                currency: Currency,
                exchangeRate: ExchangeRate,
                invoiceNumber: InvoiceNumber,
                totalLevy: "",
                userName: getUserName(),
                flag: "PARTIAL_REFUND",
                calculationType: CalculationType,
                totalVat: "",
                transactionDate: formatDate(InvoiceDate),
                totalAmount: "",
                voucherAmount: "",
                businessPartnerName: CustomerName,
                businessPartnerTin: CustomerTIN,
                saleType: SaleType,
                discountType: DiscountType,
                discountAmount: "",
                reference: generateRandomNumber(),
                groupReferenceId: "",
                purchaseOrderReference: "",
                items: products,
                invCusId: CustomerTIN,
                remarks: Remarks,
                status: "PARTIAL_REFUND"
            }));

            // Set items state
            if (Array.isArray(products) && products.length > 0) {
                const updatedItemLists = products.map((e) => {
                    const originalQuantity = e.Quantity;
                    setOriginalQuantities((prevQuantities) => ({
                        ...prevQuantities,
                        [e.itemCode]: originalQuantity,
                    }));
            
                    setCurrentQuantities((prevQuantities) => ({
                        ...prevQuantities,
                        [e.itemCode]: originalQuantity,
                    }));
            
                    return {
                        itemCode: e.itemCode,
                        itemCategory: e.ProductCategory,
                        expireDate: "",
                        description: e.ProductName,
                        quantity: originalQuantity, // Set the original quantity
                        levyAmountA: "",
                        levyAmountB: "",
                        levyAmountC: "",
                        levyAmountD: "",
                        levyAmountE: "",
                        discountAmount: e.ProductDiscount,
                        batchCode: "",
                        unitPrice: e.ProductPrice,
                        itemSubtotal: "",
                        totalVat: "",
                        totalLevy: "",
                        totalAmount: "",
                        alt: "",
                        refProQty: e.RefundedQuantity,
                    };
                });
            
                setItemLists(updatedItemLists);
            
            }
        }
    }, [refundInv]);

    // Update product Quantity
    const updateQuantity = (itemCode, newQuantity) => {
        const isValidQuantity = /^[+]?\d+([.]\d+)?$/.test(newQuantity);
        const isQuantityValid = isValidQuantity && parseFloat(newQuantity) <= originalQuantities[itemCode];
    
        setCurrentQuantities((prevQuantities) => ({
            ...prevQuantities,
            [itemCode]: isQuantityValid ? newQuantity : prevQuantities[itemCode],
        }));
    
        setItemLists((prevItemLists) =>
            prevItemLists.map((item) =>
                item.itemCode === itemCode
                    ? { ...item, quantity: isQuantityValid ? newQuantity : item.quantity }
                    : item
            )
        );
        setQuantityErrors((prevErrors) => ({
            ...prevErrors,
            [itemCode]: !isQuantityValid,
        }));
    };
    
    // handle invoice item computations
    const submitInvoice = () => {
        computeFinalRefTaxes(itemLists, header, setHeader);
        handleClose();
        setConfirmationOpen(true);
    }

    const submitFullInvoice = () => {
        setHeader((state) => ({...state, flag: 'REFUND'}));
        computeFinalRefTaxes(itemLists, header, setHeader);
        handleClose();
        setConfirmationOpen(true);
    }

    // handle cancel dialog
    const closeAlert = () => setOpen(false);

    // Seend Payload to GRA backend
    const sendPayload = async () => {
        try {
            setDrop(true);
            setConfirmationOpen(false);
            const data = await postRefundInvoice(header);
            setTimeout(() => {
                setDrop(false);
                if (data.status === "Error") {
                    const res = JSON.stringify(data.message);
                    setAlert((e) => ({ ...e, message: res, color: 'warning' }));
                    setOpen(true);
                }
                else {
                    setAlert((e) => ({ ...e, message: `${data.status}! Invoice refunded`, color: 'success' }));
                    setOpen(true);
                    setSubmitted(true);
                }
            }, 1500);
        }
        catch (error) {
            console.log('Network Error! Please refresh');
            setAlert((e) => ({ ...e, message: 'Refunding invoice failed!', color: 'warning' }));
            setOpen(true);
        }
    }

    return (
        <>
            {alert.message ?
                (<AlertError open={openAlert} alert={alert} handleClose={closeAlert} />) :
                (<ShowBackDrop open={drop} />)
            }
            <Dialog open={open} sx={{ padding: '10px' }}>
                <Grid container sx={{ justifyContent: 'space-around' }}>
                    <DialogTitle sx={{ fontSize: 18 }}>Refund Invoice</DialogTitle>
                    <DialogActions>
                        <Button variant='contained' color='primary' onClick={submitFullInvoice}>Full Refund</Button>
                        <Button variant='contained' color='inherit' onClick={submitInvoice}>Partial Refund</Button>
                        <Button variant='outlined' color='error' onClick={handleClose}>< Cancel />Close</Button>
                    </DialogActions>
                </Grid>
                <DialogContent>
                    {
                        Array.isArray(itemLists) && itemLists.length > 0 ? (
                            itemLists.map((item, index) =>
                                (
                                    <Grid container key={index} spacing={1} marginBottom={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                label='Product'
                                                disabled={true}
                                                value={item.description}
                                                size='small'
                                                fullWidth={true}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                label='Unit Price'
                                                disabled={true}
                                                value={item.unitPrice}
                                                size='small'
                                                fullWidth={true}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                label='Total Qty'
                                                disabled={true}
                                                value={originalQuantities[item.itemCode]}
                                                size='small'
                                                fullWidth={true}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                label='Refunded'
                                                disabled={true}
                                                value={item.refProQty}
                                                size='small'
                                                fullWidth={true}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                label='Refund Qty'
                                                type='number'
                                                name='quantity'
                                                value={currentQuantities[item.itemCode]}
                                                size='small'
                                                fullWidth={true}
                                                error={quantityErrors[item.itemCode]}
                                                helperText={quantityErrors[item.itemCode] ? 'Invalid quantity' : ''}
                                                onChange={(e) => updateQuantity(item.itemCode, e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                )
                            )
                        ) : null
                    }
                </DialogContent>
            </Dialog>
            <Dialog open={confirmationOpen} sx={{ padding: '20px' }}>
                <DialogTitle variant='h3'>Confirm Refund</DialogTitle>
                <DialogContent>
                    <Typography variant='h5' align='center' color='darkred'>
                        Are you sure you want to refund this invoice?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmationOpen(false)} variant='outlined' color='error'>Cancel</Button>
                    <Button onClick={sendPayload} variant='contained' color='primary'>Proceed</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default RefundForms;
