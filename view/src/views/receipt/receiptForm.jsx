/* eslint-disable */
import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Button } from '@mui/material';


import { postWaybillData } from '../../apiActions/allApiCalls/invoice';
import signature from "../../assets/images/signature.jpg"
import { getUserName } from '../../utilities/getUserName';
import { generateUUID } from "../../utilities/generateID";
import logo from "../../assets/images/logo.webp";

const headerStyle = {
    backgroundColor: 'black',
    fontWeight: 'bolder',
    padding: 10,
    color: 'white',
}

const ReceiptForm = ({ formData, closePopup }) => {
    const [form, setForm] = useState({
        mod: 'DELIVERY',
        despatchDate: '',
        receipientName: formData.CustomerName || '',
        receipientAddress: formData.customerAddress || '',
        receipientPhone: formData.customerPhone || '',
        deliveryName: 'AGYENIM BOATENG',
        deliveryPhone: '0594591572',
    });
    const printRef = useRef();
    const userName = `${getUserName()}`

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    }

    const handlePDF = () => {
        const element = printRef.current;
        const docName = `${form.receipientName} PAYMENT RECEIPT`
        html2pdf()
        .from(element)
        .save(docName);
    };

    const handleSubmit = async () => {
        // if (!form.mod || !form.despatchDate) {
        //     alert("Despatch Date cannot be empty.");
        //     return;
        // }
        try {
            // const payload = {
            //     InvoiceNumber: formData.InvoiceNumber,
            //     IssuerName: userName,
            //     CustomerID: formData.CustomerID,
            //     ...form
            // };
            // await postWaybillData(payload);
            handlePDF();
            // closePopup();
        } catch (error) {
            return;
        }
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
                <Button variant='contained' color='inherit' onClick={handleSubmit}>Print Receipt</Button>
            </div>
            <div id='WaybillBody' ref={printRef} style={{ padding: '50px', margin: '0 auto', maxWidth: '800px' }}>
                <div style={{ padding: '20px', border: '1px solid black'}}>

                    <table align="center" border={0} width='100%'>
                        <tr>
                            <td>
                                <h1 style={{ fontFamily: 'serif', fontSize: '2em', color: '#0f1683' }}>OFFICIAL RECEIPT</h1>
                            </td>
                            <td><img src={logo} width={60} height={45} alt="Logo" /></td>
                        </tr>
                    </table>


                    <table align="center" width='100%' cellSpacing={2} cellPadding={4}>
                        <tbody>
                            <tr>
                                <td width='15%'/>
                                <td width='35%' align='center' style={{ border: '2px solid grey' }}><strong>Payment Received</strong></td>
                                <td width="15%" align='center'><strong>Date</strong></td>
                                <td width='35%' style={{ borderBottom: '2px solid grey' }}>12-12-2024</td>
                            </tr>
                        </tbody>
                    </table>

                    <p />

                    <table width='100%' cellSpacing={2}>
                        <tbody>
                            <tr>
                                <td width='15%'><strong>From</strong></td>
                                <td width='85%' style={{ borderBottom: '2px solid grey' }}><p>{formData.CustomerName || 'Unavailable'}
                                    {(formData.CustomerTin && formData.CustomerTin !== 'C0000000000' ) ? (- formData.CustomerTin || '') : ''}</p>
                                </td>
                            </tr>
                            <tr>
                                <td width='15%'><strong>Amount</strong></td>
                                <td width='85%' style={{ borderBottom: '2px solid grey' }}><p>Amount in words</p></td>
                            </tr>
                            <tr>
                                <td width='15%'><strong>Reason</strong></td>
                                <td width='85%' style={{ borderBottom: '2px solid grey' }}><p>Reason...</p></td>
                            </tr>
                            <tr>
                                <td width='15%'><strong>Sales Rep</strong></td>
                                <td width='85%' style={{ borderBottom: '2px solid grey' }}><p>{formData.IssuerName || 'Unavailable'}</p></td>
                            </tr>
                            <tr>
                                <td width='15%'><strong>Telephone</strong></td>
                                <td width='85%' style={{ borderBottom: '2px solid grey' }}><p>0245152082</p></td>
                            </tr>
                        </tbody>
                    </table>

                    <p />

                    <table align="" width='100%' cellSpacing={2}>
                        <tbody>
                            <tr>
                                <td>
                                    <tr>
                                        <td width='15%'><strong>Invoice #</strong></td>
                                        <td width='35%' style={{ borderBottom: '2px solid grey' }}>{formData.InvoiceNumber || 'Unavailable'}</td>
                                    </tr>
                                    <tr>
                                        <td width="15%" ><strong>Amount</strong></td>
                                        <td width='35%' style={{ borderBottom: '2px solid grey' }}>fig</td>
                                    </tr>
                                    <tr>
                                        <td width='15%'><strong>Mode</strong></td>
                                        <td width='35%' style={{ borderBottom: '2px solid grey' }}>mop</td>
                                    </tr>
                                    <tr>
                                        <td width="15%" ><strong>ID#</strong></td>
                                        <td width='35%' style={{ borderBottom: '2px solid grey' }}>...</td>
                                    </tr>
                                </td>
                                <td>
                                    <tr>
                                        <td width="15%" align='center'><strong>Signed By</strong></td>
                                        <td width='35%'>EBO QUANSAH</td>
                                    </tr>
                                    <tr>
                                        <td width="10%" />
                                        <td colSpan={3}><img src={signature} alt='signature' width={100}/></td>
                                    </tr>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {JSON.stringify(formData)}
        </>
    );
};

export default ReceiptForm;
