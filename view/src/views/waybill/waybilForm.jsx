import React, { useState, useRef } from 'react';
import { generateUUID } from "../../utilities/generateID";
import logo from "../../assets/images/logo.webp";
import html2pdf from 'html2pdf.js';
import { Button } from '@mui/material';
import { postWaybillData } from '../../apiActions/allApiCalls/invoice';
import { getUserName } from '../../utilities/getUserName';

const headerStyle = {
    backgroundColor: 'black',
    fontWeight: 'bolder',
    padding: 10,
    color: 'white',
}

const WaybillForm = ({ formData, closePopup }) => {
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
        const docName = `${form.receipientName}`
        html2pdf()
        .from(element)
        .save(docName);
    };

    const handleSubmit = async () => {
        if (!form.mod || !form.despatchDate) {
            alert("Despatch Date cannot be empty.");
            return;
        }
        try {
            const payload = {
                InvoiceNumber: formData.InvoiceNumber,
                IssuerName: userName,
                CustomerID: formData.CustomerID,
                ...form
            };
            await postWaybillData(payload);
            handlePDF();
            closePopup();
        } catch (error) {
            console.error('PDF generation error: ', error);
        }
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
                <Button variant='contained' color='inherit' onClick={handleSubmit}>Print Waybill</Button>
            </div>
            <div id='WaybillBody' ref={printRef} style={{ padding: '20px', margin: '0 auto', maxWidth: '800px' }}>
                <table align="" width='100%' border={0}>
                    {formData ? (
                        <tbody>
                            <tr>
                                <td width='45%'>
                                    <big>Warehouse Ghana</big> <br />
                                    <small>The largest Building products market</small> <br />
                                    <img src={logo} width={130} height={85} alt="Logo" />
                                </td>
                                <td width="10%" />
                                <td width='45%'>
                                    <h1>{form.mod && form.mod === 'DELIVERY' ? 'DELIVERY NOTE' : 'Waybill'} </h1>
                                    <table width='100%'>
                                        <tbody>
                                            <tr>
                                                <td><strong> Invoice Date</strong></td>
                                                <td>{new Date(formData.InvoiceDate).toLocaleDateString()}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Invoice #</strong></td>
                                                <td>{formData.InvoiceNumber}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Waybill #</strong></td>
                                                <td>{generateUUID()}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Despatch Date</strong></td>
                                                <td>
                                                    <input 
                                                        style={{ border: 'none', outline: 'none' }} 
                                                        type='date' 
                                                        onChange={(e) => setForm({ ...form, despatchDate: e.target.value })} 
                                                        value={form.despatchDate} 
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>MOD</strong></td>
                                                <td>
                                                    <select 
                                                        style={{ border: 'none', outline: 'none' }} 
                                                        value={form.mod} 
                                                        required
                                                        onChange={(e) => setForm({ ...form, mod: e.target.value })}>
                                                        <option value='DELIVERY'>Delivery</option>
                                                        <option value='PICK UP'>Pick Up</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td colSpan="3">
                                    <p>Waybill unavailable</p>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>

                <div style={{ height: 40 }}></div>

                {/* Invoice and recipient details section */}
                <table width='100%' border={0}>
                    <tbody>
                        <tr>
                            <td width='47%'>
                                <table width='100%'>
                                    <thead style={headerStyle}>
                                        <tr>
                                            <td colSpan={2}>Invoice Details</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td width='30%'><strong>Company</strong></td>
                                            <td width='70%'>{formData.CustomerName}</td>
                                        </tr>
                                        <tr>
                                            {formData.CustomerTIN && formData.CustomerTIN !== 'C0000000000' ? (
                                                <>
                                                    <td width='30%'><strong>TIN</strong></td>
                                                    <td width='70%'>{formData.CustomerTIN}</td>
                                                </>
                                            ) : (
                                                <>
                                                    <td width='30%'><strong>Telephone</strong></td>
                                                    <td width='70%'>{formData.customerPhone}</td>
                                                </>
                                            )}
                                        </tr>
                                        <tr>
                                            <td width='30%'><strong>Address</strong></td>
                                            <td width='70%'>{formData.CustomerAddress}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>

                            <td width='6%'></td>

                            <td width='47%'>
                                <table width='100%'>
                                    <thead style={headerStyle}>
                                        <tr>
                                            <td colSpan={2}>Shipping Address | Recipient</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td width='30%'><strong>Recipient</strong></td>
                                            <td width='70%'>
                                                <input
                                                    style={{ border: 'none', outline: 'none', width: '100%' }}
                                                    value={form.receipientName}
                                                    onChange={handleChange}
                                                    name='receipientName'
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width='30%'><strong>Telephone</strong></td>
                                            <td width='70%'>
                                                <input
                                                    style={{ border: 'none', outline: 'none', width: '100%' }}
                                                    value={form.receipientPhone}
                                                    onChange={handleChange}
                                                    name='receipientPhone'
                                                    type='number'
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width='30%'><strong>Address</strong></td>
                                            <td width='70%'>
                                                <input
                                                    style={{ border: 'none', outline: 'none', width: '100%' }}
                                                    value={form.receipientAddress}
                                                    onChange={handleChange}
                                                    name='receipientAddress'
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ height: 40 }}></div>

                {/* Product details section */}
                <table width='100%' cellSpacing={1} border={1}>
                    <thead>
                        <tr>
                            <th width='5%'>SKU</th>
                            <th width='33%'>Description</th>
                            <th width='5%'>Ordered</th>
                            <th width='5%'>Delivered</th>
                            <th width='5%'>Outstanding</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.products ? (
                            formData.products.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.itemCode}</td>
                                    <td>{product.ProductName}</td>
                                    <td>{product.Quantity}</td>
                                    <td>{product.Quantity}</td>
                                    <td>{product.Quantity - product.Quantity}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">Products Unavailable</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div style={{ height: 40 }}></div>

                {/* Delivery details section */}
                <table width='100%' cellPadding={2}>
                    <tbody>{
                        form.mod && form.mod === "DELIVERY" ? <>
                        <tr>
                            <td><strong>Delivered By </strong></td>
                            <td>
                                <input
                                    style={{ border: '1px dashed gray', width: '100%', padding: 4 }}
                                    value={form.deliveryName}
                                    onChange={handleChange}
                                    name='deliveryName'
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Contact </strong></td>
                            <td>
                                <input
                                    style={{ border: '1px dashed gray', width: '100%', padding: 4 }}
                                    value={form.deliveryPhone}
                                    onChange={handleChange}
                                    name='deliveryPhone'
                                    type='number'
                                />
                            </td>
                        </tr>
                        <tr>
                            <td><strong>Signature </strong></td>
                            <td>
                                <div style={{ padding: 15 }}></div>
                            </td>
                        </tr>
                        </> : <>
                        <tr>
                            <td><strong>Sales Rep</strong></td>
                            <td>
                                <input
                                    style={{ border: '1px dashed gray', width: '100%', padding: 4 }}
                                    value={formData.IssuerName}
                                />
                            </td>
                        </tr>
                    </>}</tbody>
                </table>

                <div style={{ height: 40 }}></div>

                <pre>
                    * Notice must be given to us of any goods not received within 24 hours.<br/>
                    * Any shortage or damage must be notified within 36 hours of receipt of goods.<br/>
                    * All complaints should be forwarded to sales@warehouseghana.com within 5 days of receipt of goods.
                </pre>

                <div style={{ height: 40 }}></div>

                {/* Thank you note */}
                <div style={{ textAlign: 'center' }}>
                    <strong style={{
                        textJustify: 'inter-word',
                        fontWeight: 'bolder',
                        fontSize: '1em',
                    }}>
                        Thank you for your patronage!
                    </strong>
                    <p style={{ borderBottom: '2px dashed black' }} />
                    <p>
                        <strong>Phone:</strong> +233 (0) 245-152-082 | <strong>E-mail:</strong> sales@warehouseghana.com | <strong>Web:</strong> warehouseghana.com
                    </p>
                </div>
            </div>
        </>
    );
};

export default WaybillForm;
