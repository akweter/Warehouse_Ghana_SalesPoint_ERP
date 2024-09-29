import React, { useState } from 'react';
import { Button, ButtonGroup } from "@mui/material";
import { Close, Print } from "@mui/icons-material";
import jsPDF from 'jspdf';
import html2canvas from 'jspdf-html2canvas';
import { generateUUID } from "../../utilities/generateID";
import logo from "../../assets/images/logo.webp"

const WaybillForm = ({ formData, closeDialog, sendPayload }) => {
    const [form, setForm] = useState({
        mod: '',
        despatchDate: '',
    })

    const printPDF = () => {
        sendPayload()
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = doc.internal.pageSize.width;
        // const pageHeight = doc.internal.pageSize.height;
        const element = document.getElementById('waybill-form');

        html2canvas(element, { scale: 3 })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const ratio = pageWidth / canvas.width;
                const imgHeight = canvas.height * ratio;

                doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, imgHeight);
                doc.save(`${formData.InvoiceNumber}_waybill.pdf`);
            })
            .catch(() => {
                return null;
            });
    };

    console.log(formData.InvoiceDate);

    return (
        <span>
            <div style={{ paddingLeft: 20, paddingRight: 20 }} id="waybill-form">
                <React.Fragment>
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
                                        <h1>Waybill</h1>
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
                                                    <td><strong>Customer ID</strong></td>
                                                    <td>{formData.customerID}</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Despatch Date</strong></td>
                                                    <td>
                                                        <input type='date' onChange={(e) => setForm({...form, despatchDate: e.target.value})} value={form.despatchDate}/>
                                                        {/* {new Date().toLocaleDateString()} */}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><strong>MOD</strong></td>
                                                    <td>
                                                        <select value={form.mod} onChange={(e) => setForm({...form, mod: e.target.value})}>
                                                            <option value='OUT DELIVERY'>Out Delivery</option>
                                                            <option value='PICK UP'>Pick Up</option>
                                                        </select>
                                                        {/* OUT DELIVERY */}
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

                    <div style={{ height: 40 }} />

                    <table width='100%' border={0}>
                        <tbody>
                            <tr>
                                <td width='47%'>
                                    <strong>Shipping Address | Recipient</strong>
                                    <table width='100%' className="waybill_table">
                                        <tbody>
                                            <tr>
                                                <td width='30%'>SITE LOCATION</td>
                                                <td width='70%'>KUMASI</td>
                                            </tr>
                                            <tr>
                                                <td width='30%'>NAME</td>
                                                <td width='70%'>{formData.CustomerName}</td>
                                            </tr>
                                            <tr>
                                                <td width='30%'>COMPANY</td>
                                                <td width='70%'>{formData.CustomerName}</td>
                                            </tr>
                                            <tr>
                                                <td width='30%'>CONTACT</td>
                                                <td width='70%'>{formData.customerPhone}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                <td width='6%'></td>
                                <td width='47%'>
                                    <strong>Invoice Address | Customer</strong>
                                    <table width='100%' border={0}>
                                        <tbody>
                                            <tr>
                                                <td width='30%'>COMPANY</td>
                                                <td width='70%'>{formData.CustomerName}</td>
                                            </tr>
                                            <tr>
                                                <td width='30%'>TIN</td>
                                                <td width='50%'>{formData.CustomerTIN}</td>
                                            </tr>
                                            <tr>
                                                <td width='30%'>ADDRESS</td>
                                                <td width='70%'>{formData.CustomerAddress}</td>
                                            </tr>
                                            <tr>
                                                <td width='30%'>EMAIL | PHONE</td>
                                                <td width='70%'>{formData.CustomerEmail} | {formData.customerPhone}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div style={{ height: 40 }} />

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
                </React.Fragment>
            </div>
            <ButtonGroup component='div' sx={{ padding: 5, gap: 2 }}>
                <Button variant="contained"size="medium" color="error" onClick={closeDialog}><Close /> Close</Button>
                <Button variant="contained" color="primary" size="medium" onClick={printPDF}><Print /> Print Waybill</Button>
            </ButtonGroup>
        </span>
    );
};

export default WaybillForm;
