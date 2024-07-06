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
      id: 'order_checkout',
      title: 'Order Checkout',
      type: 'item',
      url: '/order/checkout',
      icon: IconTruckDelivery,
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
