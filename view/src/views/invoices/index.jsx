import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { CurrencyExchangeSharp, Print as PrintIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { IconButton, Grid, Box } from '@mui/material';

// projects
import MakeNewInvoice from './generateInvoice';
import { LoadingSpinner } from 'ui-component/loaderAPI';
import { RefundDialog } from 'views/refund/refundForm';
import { GeneralCatchError } from 'utilities/errorAlert';
import { fetchAllSalesInvoices } from 'apiActions/allApiCalls/invoice';
import { fetchAllCustomers } from 'apiActions/allApiCalls/customer';
import { fetchAllProducts } from 'apiActions/allApiCalls/product';
import InvoiceDetails from './invoiceDetails';
import InvoiceTemplate from './invoiceTemplate';
import { fetchRefundedProducts } from 'apiActions/allApiCalls/refund';

// /* eslint-disable */

export default function Invoice() {
    const [submitted, setSubmitted] = useState(false)
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openRefDialog, setOpenRefDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [refundInv, setRefundInv] = useState([]);
    const [alert, setAlert] = useState({ message: '', color: '' });

    useEffect(() => {
        fetchData();
    }, [submitted]);

    useEffect(() => {
        AllRefundProducts();
    }, [invoices]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch all invoices
            const invoicesData = await fetchAllSalesInvoices();

            // Fetch all customers
            const customersData = await fetchAllCustomers();

            const tinToNameMap = {};
            customersData.forEach(customer => { tinToNameMap[customer.SnC_tin] = customer.SnC_name; });

            // Fetch all products
            const productsData = await fetchAllProducts();

            const productIdToProductMap = {};
            productsData.forEach(product => {
                productIdToProductMap[product.Itm_id] = {
                    id: product.Itm_id,
                    name: product.Itm_name,
                    category: product.Itm_taxable,
                    itmDiscount: product.Inv_Product_Discount,
                    uom: product.Itm_UOM,
                };
            });
            // Update invoices with product details
            const invoicesWithProducts = invoicesData.map(invoice => {
                try{
                    const productIds = JSON.parse(invoice.Inv_Product_id);
                    const productQtys = JSON.parse(invoice.Inv_Product_qty);
                    const productDis = JSON.parse(invoice.Inv_Product_Discount);
                    const productPrice = JSON.parse(invoice.Inv_Pro_Price);
                    const invDate = invoice.Inv_date;

                    const productsWithQty = productIds.map((productId, index) => {
                        const productDetails = productIdToProductMap[productId];
                        if (!productDetails) {
                            return null;
                        }
                        return {
                            id: productDetails.id,
                            name: productDetails.name,
                            quantity: parseFloat(productQtys[index]),
                            price: parseFloat(productPrice[index]),
                            category: productDetails.category,
                            discount: parseFloat(productDis[index]),
                            uom: productDetails.uom,
                        };
                    }).filter(product => product !== null);

                    const customerDetails = customersData.find(customer => customer.SnC_tin === invoice.Inv_Customer_Tin) || {};
                    const totalProducts = productsWithQty.reduce((total, item) => total + parseFloat(item.quantity || 0), 0);

                    return {
                        ...invoice,
                        invDate: invDate,
                        customerName: tinToNameMap[invoice.Inv_Customer_Tin] || 'Cash',
                        customerPhone: customerDetails.SnC_phone || '',
                        products: productsWithQty,
                        productsTotal: totalProducts,
                    };
                }
                catch(mapError){
                    return null;
                }
            }).filter(invoice => invoice !== null);
            setTimeout(() => {
                setInvoices(invoicesWithProducts);
                setLoading(false);
            }, 900);
        }
        catch (error) {
            setInvoices([]);
            setOpen(true);
            setAlert((e) => ({ ...e, message: `Something unexpected happened with\n your connection. \n\n Please log in again if it persist.`, color: 'error' }));
            setLoading(false);
        }
    };

    const AllRefundProducts = async () => {
        try {
            const data = await fetchRefundedProducts();
            if (Array.isArray(data) && data.length > 0) {
                const sumsMap = new Map();
                data.forEach(item => {
                    const invNumber = item.Inv_Number;
                    const productQty = JSON.parse(item.Inv_Product_qty);
                    if (!sumsMap.has(invNumber)) {
                        sumsMap.set(invNumber, []);
                    }
                    productQty.forEach((qty, index) => {
                        sumsMap.get(invNumber)[index] = (sumsMap.get(invNumber)[index] || 0) + qty;
                    });
                });
                const result = Array.from(sumsMap.entries()).map(([invNumber, sums]) => ({
                    Inv_Number: invNumber,
                    Inv_Product_qty_Sum: sums
                }));
                if (result && invoices.length > 0) {
                    for (const item of result) {
                        const { Inv_Number, Inv_Product_qty_Sum } = item;
                        const matchingInvoice = invoices.find(invoice => invoice.Inv_Number === Inv_Number);
                        if (matchingInvoice) {
                            Inv_Product_qty_Sum.forEach((refundedQty, index) => {
                                if (matchingInvoice.products && matchingInvoice.products[index]) {
                                    matchingInvoice.products[index].refundedQty = refundedQty;
                                }
                            });
                        }
                    }
                }
            }
        }
        catch (error) {}
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const rowsWithIds = useMemo(() =>
        invoices.map((invoice, index) => ({
            id: index,
            ...invoice,
            Inv_date: formatDate(invoice.Inv_date),
        })),
        [invoices]
    );

    const columns = useMemo(() => {
        return [
            {
                field: 'id',
                headerName: '#',
                width: 10,
                renderCell: (params) => {
                    return params.row.id + 1;
                },
                headerClassName: 'dataGridheader',
            },
            {
                field: 'Inv_user',
                headerName: 'Issuer',
                description: 'Served By',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'Inv_Number',
                headerName: 'Invoice #',
                description: 'Invoice number',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            // {
            //     field: 'Inv_Type',
            //     headerName: 'Type',
            //     description: 'Invoice Transaction Type',
            //     flex: 1,
            //     width: 70,
            //     headerClassName: 'dataGridheader',
            // },
            {
                field: 'Inv_date',
                headerName: 'Date',
                description: 'Transaction Date',
                flex: 1,
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'customerName',
                headerName: 'Customer',
                description: 'Customer Name',
                flex: 1,
                width: 200,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'Inv_total_amt',
                headerName: 'Total Amt',
                description: 'Total Invoice Amount',
                flex: 1,
                width: 50,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'tourism',
                headerName: 'Tourism',
                description: 'Total Tourism Tax',
                flex: 1,
                width: 40,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'Inv_levies',
                headerName: 'Levies',
                description: 'Total Invoice Levies',
                flex: 1,
                width: 40,
                valueGetter: (params) => {
                    const cst = parseFloat(params.row.cst) || 0;
                    const nhil = parseFloat(params.row.nhil) || 0;
                    const getfund = parseFloat(params.row.getfund) || 0;
                    const covid = parseFloat(params.row.covid) || 0;
                    const totalLevies = cst + nhil + getfund + covid;
                    return totalLevies.toFixed(2);
                },
                headerClassName: 'dataGridheader',
            },
            {
                field: 'Inv_vat',
                headerName: 'VAT',
                description: 'Total Invoice VAT',
                flex: 1,
                width: 80,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'actions',
                headerName: 'ACTIONS',
                flex: 1,
                width: 150,
                sortable: false,
                renderCell: (params) => (<>
                    <IconButton title='View Invoice' onClick={() => handleViewIconClick(params.row)}>
                        <VisibilityIcon fontSize='medium' color='primary' />
                    </IconButton>
                    <IconButton title='Print Invoice' onClick={() => handlePrintIcon(params.row)}>
                        <PrintIcon fontSize='small' color='error' />
                    </IconButton>
                    <IconButton title='Refund Invoice' onClick={() => handleRefundBtnClick(params.row)}>
                        <CurrencyExchangeSharp fontSize='small' color='secondary' />
                    </IconButton>
                </>),
                headerClassName: 'dataGridheader',
            },
        ]
    });

    const handleViewIconClick = (row) => {
        setSelectedRow(row);
        setOpenDialog(true);
    };

    const handlePrintIcon = (row) => {
        const invoiceTemplateHTML = renderInvoiceTemplate(row);

        const printWindow = window.open('', '_blank');
        printWindow.document.body.innerHTML = invoiceTemplateHTML;
        printWindow.onload = () => {
            printWindow.print();
            printWindow.onafterprint = () => {
                printWindow.close();
            };
        };
    }

    const renderInvoiceTemplate = (row) => {
        const invoiceTemplate = ReactDOMServer.renderToStaticMarkup(< InvoiceTemplate data={row} />);
        return invoiceTemplate;
    };

    const handleRefundBtnClick = (row) => {
        setRefundInv(row);
        setOpenRefDialog(true);
    }

    const handleCloseRefDialog = () => {
        // setRefundInv(null);
        setOpenRefDialog(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleClose = (event, reason) => { if (reason === 'clickaway') { return; } setOpen(false) };

    return (
        <div>
            <Grid container sx={{ justifyContent: 'space-around' }}>
                < MakeNewInvoice setSubmitted={setSubmitted} />
            </Grid>
            {
                loading ?
                    <LoadingSpinner /> || submitted :
                    <Box sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={rowsWithIds}
                            columns={columns}
                            density='compact'
                            pageSize={5}
                            disableRowSelectionOnClick={true}
                            slots={{ toolbar: GridToolbar }}
                            hideFooterSelectedRowCount={true}
                            filterMode='client'
                            slotProps={{
                                toolbar: {
                                    showQuickFilter: true,
                                },
                            }}
                        />
                    </Box>
            }
            {
                alert.message ?
                    <GeneralCatchError alert={alert} handleClose={handleClose} open={open} /> :
                    null
            }
            {
                selectedRow && (
                    <>
                        < InvoiceDetails selectedRow={selectedRow} openDialog={openDialog} handleCloseDialog={handleCloseDialog} />
                    </>
                )
            }
            <RefundDialog
                open={openRefDialog}
                handleClose={handleCloseRefDialog}
                refundInv={refundInv ? refundInv : null}
                key={refundInv ? refundInv : null}
                setSubmitted={setSubmitted}
            />
        </div>
    );
}
