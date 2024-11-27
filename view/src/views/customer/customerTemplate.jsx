import { Button } from '@mui/material';
import React from 'react';

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
            '0245162082',
            'WAREHOUSE GHANA',
            'Active',
            4,
            'ACCRA - KANTAMANTO',
            'GHA-292738989-2',
            '',
            'SALES@WAREHOUSEGHANA.COM',
            'LOCAL',
          ],
          [
            '05XXXXXXXX',
            'COMPANY NAME',
            'Inactive',
            2,
            'COMPANY LOCATIOM',
            'TIN OR GHANA CARD',
            'EXM',
            'EMAIL@COMPANY.DOMAIN',
            'FOREIGN',
          ],
        ];
      
        const csvContent = headerRow.join(',') + '\n' + exampleRows.map(row => row.join(',')).join('\n');
      
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'custoners.csv';
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