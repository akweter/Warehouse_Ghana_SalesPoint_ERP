import {
  IconReportMoney,
  IconFileInvoice,
  IconReceiptRefund,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconUsers,
  IconTruckDelivery,
  IconBuildingFactory,
} from '@tabler/icons';
import { IconUsersGroup } from '@tabler/icons-react';

const pages = {
  id: 'actions',
  type: 'group',
  children: [
    {
      id: 'po-quotes',
      title: 'Quotations',
      type: 'item',
      url: '/po-quotes',
      icon: IconReportMoney,
      breadcrumbs: false
    },
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
      title: 'Refunds',
      type: 'item',
      url: '/refund',
      icon: IconReceiptRefund,
      breadcrumbs: false
    },
    {
      id: 'orders',
      title: 'New Orders',
      type: 'item',
      url: '/orders/new',
      icon: IconTruckDelivery,
      breadcrumbs: false
    },
    {
      id: 'orders_supplied',
      title: 'Supplied Orders',
      type: 'item',
      url: '/orders/supplied',
      icon: IconTruckDelivery,
      breadcrumbs: false
    },
    {
      id: 'purchase',
      title: 'Purchases',
      type: 'item',
      url: '/purchase',
      icon: IconBuildingFactory,
      breadcrumbs: false
    },
    {
      id: 'stock',
      title: 'Inventory',
      type: 'item',
      url: '/stock',
      icon: IconBuildingStore,
      breadcrumbs: false
    },
    {
      id: 'warehouse',
      title: 'Warehouse',
      type: 'item',
      url: '/warehouse',
      icon: IconBuildingWarehouse,
      breadcrumbs: false
    },
    {
      id: 'suppliers',
      title: 'Suppliers Directory',
      type: 'item',
      url: '/suppliers',
      icon: IconUsersGroup,
      breadcrumbs: false
    },
    {
      id: 'customer',
      title: 'Customers Directory',
      type: 'item',
      url: '/customers',
      icon: IconUsersGroup,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Employees Directory',
      type: 'item',
      url: '/user',
      icon: IconUsers,
      breadcrumbs: false
    }
  ]
}; 
 
export default pages;
