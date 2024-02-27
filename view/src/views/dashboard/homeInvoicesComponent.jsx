import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, IconButton } from '@mui/material';
import { IconEye, IconReceiptRefund } from '@tabler/icons';

// Style the Datagrid Row
const headerStyle = {
  fontWeight: 'bold',
  fontSize: '16px',
  textAlign: 'center',
};

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function RecentOrders() {
    const [data, setData] = useState(rows);

    const handleDelete = (idToDelete) => {
      const updatedData = data.filter((row) => row.id !== idToDelete);
      setData(updatedData);
    }

    const columns = [
      { field: 'id', headerName: 'Receipt #', width: 90 },
      {
        field: 'lastName',
        headerName: 'Invoice #',
        width: 150,
        editable: true,
      },
      {
        field: 'firstName',
        headerName: 'Customer',
        width: 150,
        editable: true,
      },
      {
        field: 'age',
        headerName: 'Total Amt',
        type: 'number',
        width: 150,
        editable: true,
        // align: 'center'
      },
      { field: 'delete', align: 'center', headerName: '', width: 50, renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.row.id)} color="secondary">
          <IconEye />
        </IconButton> ),
      },{ field: 'refund', align: 'center', headerName: '', width: 50, renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.row.id)} color="secondary">
          <IconReceiptRefund />
        </IconButton> ),
      },
    ];

  return (
    <>
      <Box sx={{ height: 600, width: '100%' }}>
        <Typography align='center' fontSize={20} variant='h3'>Recent Invoices</Typography>
        <DataGrid
          rows={data}
          columns={columns}
          disableRowSelectionOnClick
          hideFooterPagination
          headerStyle={headerStyle}
        />
      </Box>
    </>
  );
}
