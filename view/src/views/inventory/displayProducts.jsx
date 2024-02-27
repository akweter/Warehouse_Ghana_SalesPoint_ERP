import React, { useState, useMemo } from 'react';
import { IconButton, Box, } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import UploadCSVProducts from './uploadProducts';

const InventoryProductsTable = ({ products }) => {
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
                    let value;
                    value = "TOURISM";
                    return value;
                case "EXM":
                    let data;
                    data = "EXEMPTED";
                    return data;
                case "CST":
                    let input;
                    input = "CST";
                    return input;
                case "" || null || undefined:
                    let normal;
                    normal = "STANDARD";
                    return normal;
                default:
                    return value;
            }
        }
    }

    const rows = useMemo(() =>
        products.map((product) => ({
            ...product,
            itm_date: formatDate(product.itm_date),
            Itm_taxable: ChangeTaxType(product.Itm_taxable),
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
                field: 'Itm_name',
                headerName: 'Product/Service Name',
                description: 'Product/Service details',
                width: 300,
                headerClassName: 'dataGridheader',
                flex: 2,
            },
            {
                field: 'Itm_cat',
                headerName: 'Category',
                description: 'Product/Service category, class or group',
                width: 120,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'Itm_UOM',
                headerName: 'UOM',
                description: 'product unit of measurement',
                width: 70,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'Itm_qty',
                headerName: 'UOM QTY',
                description: 'Quantity of UOM available',
                width: 100,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'Itm_price',
                headerName: 'Unit Price',
                description: 'Product/Service Unit Price',
                width: 100,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'Itm_usr_id',
                headerName: 'Added By',
                description: 'User added Product/service',
                width: 120,
                headerClassName: 'dataGridheader',
                flex: 1,
            },
            {
                field: 'Itm_sup_id',
                headerName: 'Supplier',
                description: 'Product/Service provider or supplier',
                width: 200,
                headerClassName: 'dataGridheader',
                flex: 1,
            },
            {
                field: 'Itm_taxable',
                headerName: 'Tax type',
                description: 'Class of tax the service/product belong',
                width: 70,
                flex: 1,
                headerClassName: 'dataGridheader',
            },
            {
                field: 'itm_date',
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
                        <Edit fontSize='small' color='error' />
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
                    density='compact'
                    pageSize={5}
                    disableRowSelectionOnClick={true}
                    slots={{ toolbar: GridToolbar }}
                    hideFooterSelectedRowCount={true}
                    getRowId={(row) => row.Itm_id}
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
