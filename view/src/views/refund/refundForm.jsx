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
import { performComputations } from 'utilities/computeAllTaxes';
import { AlertError } from 'utilities/errorAlert';
import { ShowBackDrop } from 'utilities/backdrop';
import { getUserName } from 'utilities/getUserName';
import { Cancel } from '@mui/icons-material';
import { postRefundInvoice } from 'apiActions/allApiCalls/refund';

/* eslint-disable */
export const RefundDialog = ({ open, handleClose, refundInv, setSubmitted }) => {
    const [openAlert, setOpen] = useState(false);
    const [drop, setDrop] = useState(false);
    const [itemLists, setItemLists] = useState(itemlistPayload);
    const [header, setHeader] = useState(headerPayload);
    const [originalQuantities, setOriginalQuantities] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [alert, setAlert] = useState({ message: '', color: '' });

    function generateRandomNumber() {
        const length = 10;
        const randomNumber = Math.floor(Math.random() * Math.pow(10, length));
        return randomNumber.toString().padStart(length, '0');
    }

    // update the header and item state
    useEffect(() => {
        if (refundInv) {
            const {
                Inv_Customer_Tin,
                Inv_Number,
                Inv_ext_Rate,
                currency,
                Inv_Calc_Type,
                customerName,
                products,
                remarks,
                Inv_Sale_Type,
                Inv_Discount_Type,
                invDate,
            } = refundInv;

            const dateObject = new Date(invDate);
            const formattedDate = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`;

            // Set header state
            setHeader((state) => ({
                ...state,
                currency: currency,
                exchangeRate: Inv_ext_Rate,
                invoiceNumber: Inv_Number,
                totalLevy: "",
                userName: getUserName(),
                flag: "PARTIAL_REFUND",
                calculationType: Inv_Calc_Type,
                totalVat: "",
                transactionDate: formattedDate,
                totalAmount: "",
                voucherAmount: "",
                businessPartnerName: customerName,
                businessPartnerTin: Inv_Customer_Tin,
                saleType: Inv_Sale_Type,
                discountType: Inv_Discount_Type,
                discountAmount: "",
                reference: generateRandomNumber(),
                groupReferenceId: "",
                purchaseOrderReference: "",
                items: products,
                invCusId: Inv_Customer_Tin,
                remarks: remarks,
                status: "PARTIAL_REFUND"
            }));

            // Set items state
            if (Array.isArray(products) && products.length > 0) {
                setItemLists(products.map((e) => ({
                    itemCode: e.id,
                    itemCategory: e.category,
                    expireDate: "",
                    description: e.name,
                    quantity: e.quantity,
                    levyAmountA: "",
                    levyAmountB: "",
                    levyAmountC: "",
                    levyAmountD: "",
                    levyAmountE: "",
                    discountAmount: e.discount,
                    batchCode: "",
                    unitPrice: e.price,
                    itemSubtotal: "",
                    totalVat: "",
                    totalLevy: "",
                    totalAmount: "",
                    alt: "",
                    refProQty: e.refundedQty,
                })))

                // set original state
                setOriginalQuantities(
                    products.reduce((acc, product) => {
                        acc[product.id] = product.quantity;
                        return acc;
                    }, {})
                );
            }
        }
    }, [refundInv]);

    // hanlde quantity change
    const handleQtyChange = (index, newValue) => {
        setItemLists((prevItems) => {
            const updatedItems = [...prevItems];
            const originalQuantity = originalQuantities[updatedItems[index].itemCode];
            const quantityRefunded = updatedItems[index].refProQty;
            const remainingQuantity = originalQuantity - (quantityRefunded || 0);
            const validatedQuantity = Math.max(0, Math.min(newValue, remainingQuantity));
            if (remainingQuantity < 1) {
                window.alert('All quantities refunded!');
                handleClose();
            }
            else {
                updatedItems[index] = {
                    ...updatedItems[index],
                    quantity: validatedQuantity,
                };
            }
            return updatedItems;
        });
    };

    // handle invoice item computations
    const submitInvoice = () => {
        performComputations(itemLists, header, setHeader);
        handleClose();
        setConfirmationOpen(true);
    }

    const submitFullInvoice = () => {
        setHeader((state) => ({...state, flag: 'REFUND'}));
        performComputations(itemLists, header, setHeader);
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
            console.log('Network Error! Please refresh', error);
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
                    {Array.isArray(itemLists) && itemLists.length > 0 ? (
                        itemLists.map((item, index) =>
                        (<>
                            <Grid container key={item.itemCode} spacing={1} marginBottom={2}>
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
                                        // value={item.quantity || 0}
                                        size='small'
                                        fullWidth={true}
                                        onChange={(e) => handleQtyChange(index, e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </>)
                        )
                    ) : null}
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

const RefundForms = {
    RefundDialog,
}

export default RefundForms;
