// /* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { Button } from '@mui/material';
import signature from "../../assets/images/signature.jpg";
import logo from "../../assets/images/logo.webp";
import { numberToWords } from '../../utilities/amountToWords';
import { receiptPrinted } from '../../apiActions/allApiCalls/invoice';

const InputField = ({ label, value, onChange, name, type = 'text', placeholder, error, options }) => (
    <tr>
        <td width='15%'><strong>{label}</strong></td>
        <td width='85%' style={{ borderBottom: '2px solid grey' }}>
            {type === 'select' ? (
                <select
                    style={{ border: 'none', outline: 'none', width: '100%', padding: 5 }}
                    value={value}
                    onChange={onChange}
                    name={name}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    style={{ border: 'none', outline: 'none', width: '100%', padding: 5 }}
                    type={type}
                    value={value}
                    onChange={onChange}
                    name={name}
                    placeholder={placeholder}
                />
            )}
            {error && <div style={{ color: 'red', fontSize: '0.9em' }}>{error}</div>}
        </td>
    </tr>
);

const ReceiptForm = ({ formData, closePopup }) => {
    const [errors, setErrors] = useState({});
    const printRef = useRef();
    const [form, setForm] = useState({
        amountFig: '',
        receiptDate: '',
        TotalAMount: formData.TotalAMount || 0.00,
        receipientAddress: formData.customerAddress || '',
        receipientPhone: formData.customerPhone || '',
        amountWord: '',
        reason: '',
        modeOfPayment: 'CASH',
        paymentID: '',
        repTelephone: '+233245152082',
        signatureBy: 'EBO QUANSAH',
    });

    useEffect(() => {
        const amountInWords = numberToWords(Math.floor(form.TotalAMount)).toUpperCase();
        const pesewaPart = form.TotalAMount % 1 > 0 ? ` AND ${((form.TotalAMount % 1) * 100).toFixed(0)} PESEWAS` : '';
        setForm(prevForm => ({
            ...prevForm,
            amountWord: `${amountInWords}${pesewaPart}`
        }));
    }, [form.TotalAMount]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm(prevState => ({ ...prevState, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }

    const handlePDF = async() => {
        const element = printRef.current;
        const docName = `${formData.CustomerName} PAYMENT RECEIPT`;
        var options = {
            margin: 2,
            filename: docName,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(options).from(element).save()
    };

    const handleSubmit = async () => {
        let newErrors = {};
        if (!form.reason) newErrors.reason = "Please provide a reason for the receipt";
        if (!form.amountWord) newErrors.amountWord = "Amount in words is required";

        if (!form.receiptDate) { alert('Please choose the date'); return }
        else if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            await handlePDF();
            await receiptPrinted(form);
            await closePopup();
        } catch (error) {
            setErrors({ form: 'An error occurred while generating the receipt' });
        }
    }

    const paymentOptions = [
        { value: 'CASH', label: 'CASH' },
        { value: 'CARD', label: 'CARD' },
        { value: 'MOBILE MONEY', label: 'MOBILE MONEY' },
        { value: 'BANK TRANSFER', label: 'BANK TRANSFER' },
    ];

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant='contained' color='inherit' onClick={handleSubmit}>Print Receipt</Button>
            </div>
            <div id='WaybillBody' ref={printRef}>
                <div style={{ padding: '20px', border: '1px solid black' }}>
                    <table align="center" border={0} width='100%'>
                        <tr>
                            <td><h1 style={{ fontFamily: 'serif', fontSize: '2em', color: '#0f1683' }}>OFFICIAL RECEIPT</h1></td>
                            <td><img src={logo} width={70} alt="Logo" /></td>
                        </tr>
                    </table>

                    <table align="center" width='100%' cellSpacing={2} cellPadding={4}>
                        <tbody>
                            <tr>
                                <td width='15%' />
                                <td width='35%' align='center' style={{ border: '2px solid grey' }}><strong>Payment Received</strong></td>
                                <td width="15%" align='center'><strong>Date</strong></td>
                                <td width='35%' style={{ borderBottom: '2px solid grey' }}>
                                    <input
                                        style={{ border: 'none', outline: 'none' }}
                                        type='date'
                                        onChange={(e) => setForm({ ...form, receiptDate: e.target.value })}
                                        value={form.receiptDate}
                                        required
                                    />
                                    {errors.receiptDate && <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.receiptDate}</div>}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <p />

                    <table width='100%' cellSpacing={2}>
                        <tbody>
                            <InputField
                                label="From"
                                value={formData.CustomerName || 'Unavailable'}
                                error={errors.receipientName}
                            />
                            <InputField
                                label="Amount"
                                value={form.amountWord}
                                onChange={handleChange}
                                name='amountWord'
                                placeholder='AMOUNT IN WORDS'
                                error={errors.amountWord}
                            />
                            <InputField
                                label="Reason"
                                value={form.reason}
                                onChange={handleChange}
                                name='reason'
                                placeholder='PRODUCTS PURCHASED'
                                error={errors.reason}
                            />
                            <InputField
                                label="Sales Rep"
                                value={formData.IssuerName || 'Unavailable'}
                                error={errors.salesRep}
                            />
                            <InputField
                                label="Telephone"
                                value={form.repTelephone}
                                onChange={handleChange}
                                name='repTelephone'
                                error={errors.repTelephone}
                            />
                        </tbody>
                    </table>

                    <br />

                    <table width='100%' cellSpacing={2}>
                        <tbody>
                            <tr>
                                <td>
                                    <InputField
                                        label="Invoice #"
                                        value={formData.InvoiceNumber || 'Unavailable'}
                                        error={errors.invoiceNumber}
                                    />
                                    <InputField
                                        label="Amount"
                                        value={form.TotalAMount}
                                        error={errors.TotalAMount}
                                        onChange={handleChange}
                                        type='number'
                                        name='TotalAMount'
                                    />
                                    <InputField
                                        label='Mode'
                                        value={form.modeOfPayment}
                                        onChange={handleChange}
                                        name='modeOfPayment'
                                        type='select'
                                        options={paymentOptions}
                                        error={errors.modeOfPayment}
                                    />
                                    <InputField
                                        label="ID#"
                                        value={form.paymentID}
                                        onChange={handleChange}
                                        name='paymentID'
                                        error={errors.paymentID}
                                    />
                                </td>
                                <td>
                                    <tr>
                                        <td align='center'><strong>Signed By</strong></td>
                                        <td rowSpan={4}><img src={signature} alt='signature' width={100} /></td>
                                    </tr>
                                    <tr>
                                        <td rowSpan={3}>
                                            <input
                                                style={{ border: 'none', outline: 'none', width: '100%', padding: 2 }}
                                                value={form.signatureBy}
                                                onChange={handleChange}
                                                name='signatureBy'
                                            />
                                        </td>
                                    </tr>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ReceiptForm;
