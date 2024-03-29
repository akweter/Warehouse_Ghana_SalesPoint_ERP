import React, { useState, useMemo } from 'react';
import { IconButton, Box, } from '@mui/material';
import { EditNote } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import UploadCSVProducts from './uploadProducts';

/* eslint-disable */

const InventoryProductsTable = ({ products, loading }) => {
    const [open, setOpen] = useState(false);
    const [row, setRow] = useState([]);

    const handleClose = () => { setOpen(false) }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const ChangeTaxType = (value) => {
        if (value) {
            switch (value) {
                case "TRSM":
                    return "TOURISM";
                case "EXM":
                    return "EXEMPTED";
                case "CST":
                    return "CST";
                default:
                    return "STANDARD";
            }
        }
    }

    const rows = useMemo(() =>
        products.map((product) => ({
            ...product,
            dateAdded: formatDate(product.dateAdded),
            taxType: ChangeTaxType(product.taxType),
        })),
        [products]
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
                field: 'productName',
                headerName: 'Product/Service Name',
                description: 'Product/Service details',
                width: 300,
                headerClassName: 'dataGridheader',
                flex: 2,
            },
            {
                field: 'productCategory',
                headerName: 'Category',
                description: 'Product/Service category, class or group',
                width: 120,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'productUOM',
                headerName: 'UOM',
                description: 'product unit of measurement',
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'stockQTY',
                headerName: 'UOM QTY',
                description: 'Quantity of UOM available',
                width: 100,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'unitPrice',
                headerName: 'Unit Price',
                description: 'Product/Service Unit Price',
                width: 100,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'userName',
                headerName: 'Added By',
                description: 'User added Product/service',
                width: 120,
                headerClassName: 'dataGridheader',
                flex: 1,
            },
            {
                field: 'supplierName',
                headerName: 'Supplier',
                description: 'Product/Service provider or supplier',
                width: 200,
                headerClassName: 'dataGridheader',
                flex: 1,
            },
            {
                field: 'taxType',
                headerName: 'Tax type',
                description: 'Class of tax the service/product belong',
                width: 70,
                flex: 1,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'dateAdded',
                headerName: 'Date',
                description: 'Date added',
                width: 100,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'edit',
                headerName: 'Edit',
                width: 30,
                headerClassName: 'dataGridheader',
                sortable: false,
                renderCell: (params) => (<>
                    <IconButton title='Edit product/service' onClick={() => handleEditconClick(params.row)}>
                        <EditNote color='error' />
                    </IconButton>
                </>),
            },
        ]
    });

    const handleEditconClick = (row) => {
        setRow(row);
        setOpen(true)
    }

    return (
        <>
            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows.map((row, index) => ({ ...row, id: index }))}
                    columns={columns}
                    loading={loading ? loading : null}
                    density='compact'
                    pageSize={5}
                    disableRowSelectionOnClick={true}
                    slots={{ toolbar: GridToolbar }}
                    hideFooterSelectedRowCount={true}
                    getRowId={(row) => row.productID}
                    filterMode='client'
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                />
            </Box>
            < UploadCSVProducts CloseDialog={handleClose} openDialog={open} productLine={row} />
        </>
    );
};

export default InventoryProductsTable;
