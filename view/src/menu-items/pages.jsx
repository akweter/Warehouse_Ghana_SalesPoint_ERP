import {
  IconReportMoney,
  IconFileInvoice,
  IconReceiptRefund,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconUsers,
} from '@tabler/icons';
import { IconUsersGroup } from '@tabler/icons-react';

const pages = {
  id: 'actions',
  type: 'group',
  children: [
    {
      id: 'invoice',
      title: 'Invoices',
      type: 'item',
      url: '/invoice',
      icon: IconFileInvoice,
      breadcrumbs: false
    },
    {
      id: 'refund',
      title: 'Refund',
      type: 'item',
      url: '/refund',
      icon: IconReceiptRefund,
      breadcrumbs: false
    },
    {
      id: 'stock',
      title: 'Inventory',
      type: 'item',
      url: '/stock',
      icon: IconBuildingWarehouse,
      breadcrumbs: false
    },
    {
      id: 'partner',
      title: 'Customer & Suppliers',
      type: 'item',
      url: '/partner',
      icon: IconUsersGroup,
      breadcrumbs: false
    },
    {
      id: 'po-quotes',
      title: 'P.O & Quotations',
      type: 'item',
      url: '/po-quotes',
      icon: IconReportMoney,
      breadcrumbs: false
    },
    {
      id: 'purchase',
      title: 'Purchase Records',
      type: 'item',
      url: '/purchase',
      icon: IconBuildingStore,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Staff Management',
      type: 'item',
      url: '/user',
      icon: IconUsers,
      breadcrumbs: false
    }
  ]
}; 
 
export default pages;
