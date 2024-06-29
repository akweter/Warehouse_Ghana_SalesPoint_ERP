// import { lazy } from 'react';
// import MainLayout from '../layout/MainLayout';
// import Loadable from '../ui-component/Loadable';
// import ProtectedRoute from '../auth/protectedRoute';
// import WoocommerceApi from '../woocommerce';
// // Oll projects
// const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// // Departmental projects
// const AccountsDp = Loadable(lazy(() => import('views/management/account')));
// const SysAdmin = Loadable(lazy(() => import('views/management/IT')));
// const OperationDp = Loadable(lazy(() => import('views/management/operation')));
// const LogisticDP = Loadable(lazy(() => import('views/management/logistic')));
// const LegalDp = Loadable(lazy(() => import('views/management/legal')));
// const MarketNSaleDp = Loadable(lazy(() => import('views/management/salesMarketing')));
// const ProcurementDP = Loadable(lazy(() => import('views/management/procurement')));
// const HRDp = Loadable(lazy(() => import('views/management/hr')));

// // Service pages
// const Invoices = Loadable(lazy(() => import('views/invoices')));
// const Purchase = Loadable(lazy(() => import('views/purchases')));
// const SalesReport = Loadable(lazy(() => import('views/SalesReport')));
// const CustomerNSupplier = Loadable(lazy(() => import('views/customerSuppliers')));
// const Inventory = Loadable(lazy(() => import('views/inventory')));
// const Refund = Loadable(lazy(() => import('views/refund')));
// const Users = Loadable(lazy(() => import('views/userManagements')));
// const Warehouse = Loadable(lazy(() => import('views/warehouse')));
// const OrderCheckout = Loadable(lazy(() => import('views/order')));

// const Auth = Loadable(lazy(() => import('auth')));
// const Woocommerce = Loadable(lazy(() => import('woocommerce')));
// const Tools = Loadable(lazy(() => import('reports')));

// const MainRoutes = {
//   path: '',
//   element: <ProtectedRoute> <MainLayout /></ProtectedRoute>,
//   children: [
//     {
//       path: '/',
//       element: <ProtectedRoute><DashboardDefault /></ProtectedRoute>
//     },
//     {
//       path: 'account',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><AccountsDp /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'hr',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><HRDp /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'IT',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><SysAdmin /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'operation', 
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><OperationDp /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'salesmart',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><MarketNSaleDp /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'legal',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><LegalDp /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'warehouse',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><Warehouse /></ProtectedRoute>
//         } 
//       ]
//     },
//     {
//       path: 'order/checkout',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><OrderCheckout /></ProtectedRoute>
//         } 
//       ]
//     },
//     {
//       path: 'procurement',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><ProcurementDP /></ProtectedRoute>
//         } 
//       ]
//     },
//     {
//       path: 'logistic',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><LogisticDP /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'invoice',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><Invoices /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'po-quotes',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><SalesReport /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'purchase',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><Purchase /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'stock',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><Inventory /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'partner',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><CustomerNSupplier /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'refund',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><Refund /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'user',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><Users /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'auth',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><Auth /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'woocommerce',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><Woocommerce /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: '',
//       children: [
//         {
//           path: 'allorders',
//           element: <ProtectedRoute><WoocommerceApi /></ProtectedRoute>
//         }
//       ]
//     },
//     {
//       path: 'reports',
//       children: [
//         {
//           path: '',
//           element: <ProtectedRoute><Tools /></ProtectedRoute>
//         }
//       ]
//     },
//   ]
// };

// export default MainRoutes;


import { Link } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import ProtectedRoute from '../auth/protectedRoute';
import WoocommerceApi from '../woocommerce';

// Lazy loaded components
const DashboardDefault = Loadable(lazy(() => import('../views/dashboard')));
const AccountsDp = Loadable(lazy(() => import('../views/management/account')));
const SysAdmin = Loadable(lazy(() => import('../views/management/IT')));
const OperationDp = Loadable(lazy(() => import('../views/management/operation')));
const LogisticDP = Loadable(lazy(() => import('../views/management/logistic')));
const LegalDp = Loadable(lazy(() => import('../views/management/legal')));
const MarketNSaleDp = Loadable(lazy(() => import('../views/management/salesMarketing')));
const ProcurementDP = Loadable(lazy(() => import('../views/management/procurement')));
const HRDp = Loadable(lazy(() => import('../views/management/hr')));
const Invoices = Loadable(lazy(() => import('../views/invoices')));
const Purchase = Loadable(lazy(() => import('../views/purchases')));
const SalesReport = Loadable(lazy(() => import('../views/SalesReport')));
const CustomerNSupplier = Loadable(lazy(() => import('../views/customerSuppliers')));
const Inventory = Loadable(lazy(() => import('../views/inventory')));
const Refund = Loadable(lazy(() => import('../views/refund')));
const Users = Loadable(lazy(() => import('../views/userManagements')));
const Warehouse = Loadable(lazy(() => import('../views/warehouse')));
const OrderCheckout = Loadable(lazy(() => import('../views/order')));
const Auth = Loadable(lazy(() => import('../auth')));
const Woocommerce = Loadable(lazy(() => import('../woocommerce')));
const Tools = Loadable(lazy(() => import('../reports')));

// Function to get accountType from sessionStorage
const getAccountType = () => {
  const systemUser = window.sessionStorage.getItem('userInfo');
  if (systemUser) {
    const parseSystemUser = JSON.parse(systemUser);
    return parseSystemUser.accountType;
  }
  return null;
};

// Function to check if user can access Users component
const canAccessUsersComponent = (accountType) => {
  return accountType !== 'admin'; // admin cannot access Users component
};

const MainRoutes = {
  path: '',
  element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
  children: [
    {
      path: '/',
      element: <ProtectedRoute><DashboardDefault /></ProtectedRoute>
    },
    {
      path: 'account',
      children: [
        {
          path: '',
          element: <ProtectedRoute><AccountsDp /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'hr',
      children: [
        {
          path: '',
          element: <ProtectedRoute><HRDp /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'IT',
      children: [
        {
          path: '',
          element: <ProtectedRoute><SysAdmin /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'operation',
      children: [
        {
          path: '',
          element: <ProtectedRoute><OperationDp /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'salesmart',
      children: [
        {
          path: '',
          element: <ProtectedRoute><MarketNSaleDp /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'legal',
      children: [
        {
          path: '',
          element: <ProtectedRoute><LegalDp /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'warehouse',
      children: [
        {
          path: '',
          element: <ProtectedRoute><Warehouse /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'order/checkout',
      children: [
        {
          path: '',
          element: <ProtectedRoute><OrderCheckout /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'procurement',
      children: [
        {
          path: '',
          element: <ProtectedRoute><ProcurementDP /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'logistic',
      children: [
        {
          path: '',
          element: <ProtectedRoute><LogisticDP /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'invoice',
      children: [
        {
          path: '',
          element: <ProtectedRoute><Invoices /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'po-quotes',
      children: [
        {
          path: '',
          element: <ProtectedRoute><SalesReport /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'purchase',
      children: [
        {
          path: '',
          element: <ProtectedRoute><Purchase /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'stock',
      children: [
        {
          path: '',
          element: <ProtectedRoute><Inventory /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'partner',
      children: [
        {
          path: '',
          element: <ProtectedRoute><CustomerNSupplier /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'refund',
      children: [
        {
          path: '',
          element: <ProtectedRoute><Refund /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'user',
      children: [
        {
          path: '',
          element: <ProtectedRoute>{canAccessUsersComponent(getAccountType()) ? <Users /> : <Link to="/" />}</ProtectedRoute>
        }
      ]
    },
    {
      path: 'auth',
      children: [
        {
          path: '',
          element: <ProtectedRoute><Auth /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'woocommerce',
      children: [
        {
          path: '',
          element: <ProtectedRoute><Woocommerce /></ProtectedRoute>
        }
      ]
    },
    {
      path: '',
      children: [
        {
          path: 'allorders',
          element: <ProtectedRoute><WoocommerceApi /></ProtectedRoute>
        }
      ]
    },
    {
      path: 'reports',
      children: [
        {
          path: '',
          element: <ProtectedRoute><Tools /></ProtectedRoute>
        }
      ]
    },
  ]
};

export default MainRoutes;
