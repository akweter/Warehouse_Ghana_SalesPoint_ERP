import React from 'react';
import { Button } from '@mui/material';

const CustomerTemplate = () => {
  const handleDownload = () => {
    const headerRow = [
      'Telephone',
      'FullName',
      'Status',
      'Rating',
      'Address',
      'TinGhanaCard',
      'Category',
      'Email',
      'Destination',
    ];

    const exampleRows = [
      [
        '233245162082',
        'WAREHOUSE GHANA',
        'Active',
        4,
        'ACCRA CENTRAL',
        'CXXXXXXXXXX',
        'Taxable',
        'SALES@WAREHOUSEGHANA.COM',
        'LOCAL',
      ],
      [
        '233540544760',
        'JN-AKWETER ENTERPRISE',
        'Inactive',
        3,
        'ABLEKUMA - ACCRA',
        'GHA-428347939-2',
        'Exempted',
        'JN-AKWETER@GMAIL.COM',
        'FOREIGN',
      ],
    ];

    const csvContent = headerRow.join(',') + '\n' + exampleRows.map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'customers.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <Button
      onClick={handleDownload}
      variant='contained'
      color='secondary'
    >
      Download Customers Template
    </Button>
  );
};

export default CustomerTemplate;