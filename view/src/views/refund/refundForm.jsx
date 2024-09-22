import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography,
    Box
} from '@mui/material';
import { Cancel } from '@mui/icons-material';

import { headerPayload } from '../../views/payload/payloadStructure';
import { AlertError } from '../../utilities/errorAlert';
import { ShowBackDrop } from '../../utilities/backdrop';
import { getUserName } from '../../utilities/getUserName';
import { postRefundInvoice } from '../../apiActions/allApiCalls/refund';
import { computeStandardTaxes } from '../../utilities/computeAllTaxes';

/* eslint-disable */
const RefundForms = ({ open, handleClose, refundInv, setSubmitted }) => {
    const [openAlert, setOpen] = useState(false);
    const [drop, setDrop] = useState(false);
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
        if (date instanceof Date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        }
        return '';
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
                transactionDate: formatDate(new Date()),
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
                invoiceType: "Partial_Refund",
                invCusId: CustomerTIN,
                remarks: Remarks,
                status: "Partial_Refund"
            }));

            // Set items state
            if (Array.isArray(products) && products.length > 0) {
                const updatedItemLists = products.map((e) => {

                    const qty = e.Quantity;
                    setOriginalQuantities((val) => ({ ...val, [e.itemCode]: qty }));
                    setCurrentQuantities((val) => ({ ...val, [e.itemCode]: qty }));

                    return {
                        itemCode: e.itemCode,
                        itemCategory: e.ProductCategory,
                        expireDate: "",
                        description: e.ProductName,
                        quantity: qty,
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
                setHeader((state) => ({ ...state, items: updatedItemLists }));
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

        // Update the specific item in the header state
        setHeader((prevHeader) => ({
            ...prevHeader,
            items: prevHeader.items.map((item) =>
                item.itemCode === itemCode ? { ...item, quantity: isQuantityValid ? newQuantity : item.quantity } : item
            ),
        }));
        setQuantityErrors((err) => ({ ...err, [itemCode]: !isQuantityValid }));
    };

    // handle invoice item computations
    const submitInvoice = () => {
        const result = computeStandardTaxes(header);
        const {
            totalLevy,
            totalAmount,
            voucherAmount,
            discountAmount,
            nhil,
            getfund,
            covid,
            cst,
            tourism,
            items,
            totalVat,
        } = result;
        setHeader((state) => ({
            ...state,
            totalAmount: totalAmount,
            voucherAmount: voucherAmount,
            discountAmount: discountAmount,
            totalLevy: totalLevy,
            nhil: nhil,
            getfund: getfund,
            tourism: tourism,
            covid: covid,
            items: items,
            cst: cst,
            totalVat: totalVat,
        }));
        handleClose();
        setConfirmationOpen(true);
    }

    const submitFullInvoice = () => {
        const result = computeStandardTaxes(header);
        const {
            totalLevy,
            totalAmount,
            voucherAmount,
            discountAmount,
            nhil,
            getfund,
            covid,
            cst,
            tourism,
            items,
            totalVat,
        } = result;
        setHeader((state) => ({
            ...state,
            totalAmount: totalAmount,
            voucherAmount: voucherAmount,
            discountAmount: discountAmount,
            totalLevy: totalLevy,
            nhil: nhil,
            getfund: getfund,
            tourism: tourism,
            covid: covid,
            items: items,
            cst: cst,
            flag: 'REFUND',
            totalVat: totalVat,
        }));
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
            <Box sx={{ padding: '10px' }}>
                <Grid container sx={{ justifyContent: 'space-around', backgroundColor: 'darkblue' }}>
                    <DialogTitle sx={{ fontSize: 18, color: 'white' }}>Cancel Invoice Transaction</DialogTitle>
                    <DialogActions>
                        <Button variant='contained' color='error' onClick={submitFullInvoice}>Total Void</Button>
                        <Button variant='contained' color='warning' onClick={submitInvoice}>Partial Void</Button>
                        <Button variant='outlined' color='error' onClick={handleClose}>< Cancel />Close</Button>
                    </DialogActions>
                </Grid>
                <DialogContent>
                    {
                        Array.isArray(header.items) && header.items.length > 0 ? (
                            header.items.map((item, index) =>
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
                                            disabled={originalQuantities[item.itemCode] === item.refProQty ? true : false}
                                        />
                                    </Grid>
                                </Grid>
                            )
                            )
                        ) : null
                    }
                </DialogContent>
            </Box>
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
