import { PeopleOutline } from '@mui/icons-material';
import {
  IconReportMoney,
  IconFileInvoice,
  IconReceiptRefund,
  // IconBuildingStore,
  // IconBuildingWarehouse,
  IconUsers,
  IconTruckDelivery,
  IconBuildingFactory,
  IconListDetails,
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
      title: 'Deliveries',
      type: 'item',
      url: '/orders/new',
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
      icon: IconListDetails,
      breadcrumbs: false
    },
    {
      id: 'suppliers',
      title: 'Suppliers',
      type: 'item',
      url: '/suppliers',
      icon: IconUsers,
      breadcrumbs: false
    },
    {
      id: 'customer',
      title: 'Customers',
      type: 'item',
      url: '/customers',
      icon: IconUsersGroup,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Users MGT',
      type: 'item',
      url: '/user',
      icon: PeopleOutline,
      breadcrumbs: false
    }
  ]
}; 
 
export default pages;
