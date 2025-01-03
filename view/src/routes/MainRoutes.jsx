import { Link } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '../layout/MainLayout';
import Loadable from '../ui-component/Loadable';
import ProtectedRoute from '../auth/protectedRoute';
import WoocommerceApi from '../woocommerce';
import {
    SuperAdmin,
    SuperAdminAndAdmin,
    ExeptTemporalInternAndGuest
} from './Access';

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
const Logs = Loadable(lazy(() => import('../views/systemLogs')));
const SalesReport = Loadable(lazy(() => import('../views/SalesReport')));
const Customers = Loadable(lazy(() => import('../views/customer')));
const Suppliers = Loadable(lazy(() => import('../views/suppliers')));
const Inventory = Loadable(lazy(() => import('../views/inventory')));
const Refund = Loadable(lazy(() => import('../views/refund')));
const Users = Loadable(lazy(() => import('../views/userManagements')));
const OrderCheckout = Loadable(lazy(() => import('../views/waybill')));
const Deliveries = Loadable(lazy(() => import('../views/deliveries')));
const Auth = Loadable(lazy(() => import('../auth')));
const Woocommerce = Loadable(lazy(() => import('../woocommerce')));
const Tools = Loadable(lazy(() => import('../reports')));

// Function to get accountType from localStorage
const getAccountType = () => {
    const systemUser = window.localStorage.getItem('userInfo');
    if (systemUser) {
        const parseSystemUser = JSON.parse(systemUser);
        return parseSystemUser.accountType;
    }
    return null;
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
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <AccountsDp /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'hr',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <HRDp /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'IT',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute>{SuperAdminAndAdmin(getAccountType()) ? <SysAdmin /> : <Link to={<MainLayout />} />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'operation',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <OperationDp /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'salesmart',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <MarketNSaleDp /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'legal',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <LegalDp /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'orders/despatch',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute><OrderCheckout /></ProtectedRoute>
                }
            ]
        },
        {
            path: 'orders/deliveries',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute><Deliveries /></ProtectedRoute>
                }
            ]
        },
        {
            path: 'procurement',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <ProcurementDP /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'logistic',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <LogisticDP /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'invoice',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute> <Invoices /></ProtectedRoute>
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
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <Purchase /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'admin/logs',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute>{SuperAdmin(getAccountType()) ? <Logs /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'stock',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <Inventory /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'customers',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <Customers /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'suppliers',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <Suppliers /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'refund',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute><Refund /> </ProtectedRoute>
                }
            ]
        },
        {
            path: 'user',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute>{SuperAdmin(getAccountType()) ? <Users /> : <Link to={<MainLayout />} />}</ProtectedRoute>
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
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <Woocommerce /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: '',
            children: [
                {
                    path: 'allorders',
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <WoocommerceApi /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
        {
            path: 'reports',
            children: [
                {
                    path: '',
                    element: <ProtectedRoute>{ExeptTemporalInternAndGuest(getAccountType()) ? <Tools /> : <Link to='/' />}</ProtectedRoute>
                }
            ]
        },
    ]
};

export default MainRoutes;
