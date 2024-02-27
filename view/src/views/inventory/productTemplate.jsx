import { Button } from '@mui/material';
import React from 'react';

const ProductTemplate = () => {
    const handleDownload = () => {
        const headerRow = [
          'productCategory',
          'productName',
          'productStatus',
          'productStockQty',
          'productUnitPrice',
          'productSupId',
          'productTaxType',
          'productUOM',
        ];
      
        const exampleRows = [
          [
            'NAILS',
            '4 INCHES ALUMINIUM ROOFING NAIL',
            'Active',
            '70',
            '650.00',
            'GH23I',
            '',
            'BOX',
          ],
          [
            'ROOM',
            'EXECUTIVE HOTEL ROOM WITH SHOWER BATH (AC)',
            'Inactive',
            '7',
            '1500.00',
            'B63H',
            'TRSM',
            'SINGLE',
          ],
          [
            'COMPUTER',
            '12 INCH DELL LAPTOP 360 BLUE SHADE',
            'Inactive',
            '200',
            '20000.00',
            'LP453',
            'EXM',
            'PC',
          ],
          [
            'NETWORK',
            '4G SURVEILLANCE PROTOCOL PACK',
            'Active',
            '7500',
            '125.50',
            'FR5C',
            'CST',
            'TIER',
          ],
        ];
      
        const csvContent = headerRow.join(',') + '\n' + exampleRows.map(row => row.join(',')).join('\n');
      
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'products.csv';
        link.click();
        URL.revokeObjectURL(link.href);
      };

  return (
    <Button onClick={handleDownload} variant='contained' color='secondary' size='small'>Download Product Template</Button>
  );
};

export default ProductTemplate;