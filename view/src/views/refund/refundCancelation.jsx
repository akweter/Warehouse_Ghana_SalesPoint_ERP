import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Typography
} from '@mui/material';
import { AlertError } from '../../utilities/errorAlert';
import { ShowBackDrop } from '../../utilities/backdrop';
import { postRefundCancellation } from '../../apiActions/allApiCalls/invoice';

export const RefundCancellationForm = ({ open, handleClose, refData, setSubmitted }) => {
    const [openAlert, setOpen] = useState(false);
    const [drop, setDrop] = useState(false);
    const [alert, setAlert]= useState({message: '', color: ''});
    const [refundData, setRefundData] = useState({
        invoiceNumber: "",
        reference: "",
        userName: "",
        flag: "",
        transactionDate: "",
        totalAmount: 0.00
    });

    // update the refundData and item state
    useEffect(() => {
        if(refData){
            const {
                TotalAmount,
                InvoiceNumber,
                InvoiceDate,
                IssuerName,
                Reference,
            } = refData;

            // Set refundData state
            setRefundData((state) => ({
                ...state,
                flag: 'REFUND_CANCELATION',
                invoiceNumber: InvoiceNumber,
                reference: Reference,
                totalAmount: TotalAmount,
                transactionDate: formatDate(InvoiceDate),
                userName: IssuerName,
            }));
        }
    }, [refData]);

    // Set Date value according to GRA API standard
    const formatDate = (date) => {
        if (date) {
            const parts = date.split('/');
            const formattedDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
            return formattedDate;
        }
    }
    
    // close alert snackbar
    const closeAlert = () => setOpen(false);

    // method that calls the payloads
    const sendPayload = () =>{
        handleClose();
        setDrop(true);
        setTimeout( async() => {
            try {
                // Post Refund cancellation
                const data = await postRefundCancellation(refundData);
                if (data.status === "Error") {
                    const res = JSON.stringify(data.message);
                    setAlert((e)=> ({...e, message: res, color: 'warning'}));
                    setOpen(true);
                }
                else {
                    setDrop(false);
                    setAlert((e)=> ({...e, message: data.status, color: 'success'}));
                    setOpen(true);
                    setSubmitted(true);
                }
            }
            catch (error) {
                setDrop(false);
                setAlert((e)=> ({...e, message: 'Invoice refund failed. Please refresh and try again', color: 'info'}));
                setOpen(true);
            }
        }, 2000);
    }

    return (<>
        { alert.message ?
            (<AlertError open={openAlert} alert={alert} handleClose={closeAlert} />) :
            (<ShowBackDrop open={drop} />)
        }
        <Dialog open={open} sx={{ padding: '20px' }}>
            <DialogTitle color='red' variant='h3'>Confirm Refund Cancellation</DialogTitle>
            <DialogContent>
                <Typography variant='h4' align='center'>
                    Are you sure you want to cancel the refund?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant='outlined' color='error'>Cancel</Button>
                <Button onClick={sendPayload} variant='contained' color='primary'>Proceed</Button>
            </DialogActions>
        </Dialog>
    </>);
};

export default RefundCancellationForm;
