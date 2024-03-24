import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';

// project imports
import TotalSalesCard from './homeSalesReportCard';
import HomeRecentOrders from './homeRecentOrdersCard';
import TotalTaxes from './homeTaxesCard';
import Screens from 'ui-component/cardDivision';
import { ThemeProvider } from 'styled-components';
import HomeDarkCard from './darkCard';
import TotalCsutomersCard from './homeCustomersCard';
import TotalSuppliersCard from './homeProductsCard';
import { fetchAllTodaySalesInvoices, } from 'apiActions/allApiCalls/invoice';
import { formatCurrencyNumber } from 'utilities/formatAmount';
import { fetchAllCustomers } from 'apiActions/allApiCalls/customer';
import { fetchAllProducts } from 'apiActions/allApiCalls/product';
import { fetchAllForeignSuppliers, fetchAllLocalSuppliers } from 'apiActions/allApiCalls/supplier';
import { fetchAllTodayRefundsInvoices, fetchTodayRefundsCancelledInvoices } from 'apiActions/allApiCalls/refund';
import DashboardBarChart from 'views/SalesReport/chart/dashboardBarChart';
import DashBoardPieChart from 'views/SalesReport/chart/dashboardPieChart';
import Addons from './addons';
import DashboardSalesGraph from './DashboardSalesGraph';

const Dashboard = () => {
	const [isLoading, setLoading] = useState(true);
	const [invoices, setInvoices] = useState([]);
	const [refunds, setRrefunds] = useState([]);
	const [cancelRefunds, setCancelRefunds] = useState([]);
	const [totalVAT, setTotalVAT] = useState(0);
	const [totalLevies, setTotalLevies] = useState(0);
	const [customers, setCustomers] = useState([]);
	const [products, setProducts] = useState([]);
	const [lSuppliers, setLSuppliers] = useState([]);
	const [fSuppliers, setFSuppliers] = useState([]);

	const TodaySales = async () => {
		try {
			const invoice = await fetchAllTodaySalesInvoices();
			setInvoices(invoice);
		}
		catch (error) {
			setInvoices([]);
		}
	}
	const TodayRefund = async () => {
		try {
			const refund = await fetchAllTodayRefundsInvoices();
			setRrefunds(refund);
		}
		catch (error) {
			setRrefunds([]);
		}
	}
	const TodayRefundCancel = async () => {
		try {
			const cancelRefs = await fetchTodayRefundsCancelledInvoices();
			setCancelRefunds(cancelRefs);
		}
		catch (error) {
			setCancelRefunds([]);
		}
	}
	const AllCustomers = async () => {
		try {
			const customers = await fetchAllCustomers();
			setCustomers(customers);
		}
		catch (error) {
			setCustomers([]);
		}
	}
	const AllProducts = async () => {
		try {
			const products = await fetchAllProducts();
			setProducts(products);
		}
		catch (error) {
			setProducts([]);
		}
	}
	const AllLocalSuppliers = async () => {
		try {
			const lsuppliers = await fetchAllLocalSuppliers();
			if (Array.isArray(lsuppliers)) {
				setLSuppliers(lsuppliers);
			} else {
				setLSuppliers([]);
			}
		}
		catch (error) {
			setLSuppliers([]);
		}
	}
	const AllForeignSuppliers = async () => {
		try {
			const fsuppliers = await fetchAllForeignSuppliers();
			if (Array.isArray(fsuppliers)) {
				setFSuppliers(fsuppliers);
			} else {
				setFSuppliers([]);
			}
		}
		catch (error) {
			setFSuppliers([]);
		}
	}

	useEffect(() => {
		TodaySales();
		TodayRefund();
		TodayRefundCancel();
		AllCustomers();
		AllProducts();
		AllLocalSuppliers();
		AllForeignSuppliers();
	}, []);

	useEffect(() => {
		if (invoices.length > 0) {
			const calculateVAT = () => {
				return formatCurrencyNumber(
					invoices.reduce((e, invoice) => {
						return e + parseFloat(invoice.Inv_vat);
					}, 0).toFixed(2)
				);
			};

			const calculateLevies = () => {
				return formatCurrencyNumber(
					invoices.reduce((e, invoice) => {
						return (
							e +
							parseFloat(invoice.covid || 0) +
							parseFloat(invoice.nhil || 0) +
							parseFloat(invoice.getfund || 0) +
							parseFloat(invoice.tourism || 0)
						);
					}, 0).toFixed(2)
				);
			};

			setTotalVAT(calculateVAT());
			setTotalLevies(calculateLevies());
		}
	}, [invoices, totalLevies, totalVAT]);

	useEffect(() => {
		setLoading(false);
	}, [invoices, isLoading]);

	return (
		<ThemeProvider theme={Screens.lightTheme}>
			<Grid container>
				<Grid container marginBottom={3}>
					<HomeDarkCard cancelRefunds={cancelRefunds} invoices={invoices} refunds={refunds} />
				</Grid>

				<Grid container spacing={3} marginBottom={3}>
					<Grid item sx={12} sm={6} md={3}><TotalCsutomersCard isLoading={isLoading} /></Grid>
					<Grid item sx={12} sm={6} md={3}><TotalTaxes isLoading={isLoading} levies={totalLevies} vats={totalVAT} /></Grid>
					<Grid item sx={12} sm={6} md={3}><TotalSalesCard isLoading={isLoading} customers={customers} products={products} /></Grid>
					<Grid item sx={12} sm={6} md={3}><TotalSuppliersCard isLoading={isLoading} foreign={fSuppliers.length} local={lSuppliers.length} /></Grid>
				</Grid>

				<Grid container marginBottom={3}>
					<Grid item sx={12} sm={10} md={8}>
						<DashboardBarChart />
					</Grid>
					<Grid item sx={12} sm={6} md={4}>
						<DashBoardPieChart />
					</Grid>
				</Grid>

				<Grid container>
					<Grid item sx={12}>
						<HomeRecentOrders isLoading={isLoading} />
					</Grid>
				</Grid>

				<Grid container>
					<Grid item sx={12}>
						<Addons isLoading={isLoading} />
					</Grid>
				</Grid>
				
				<Grid container>
					<Grid item sx={12}>
						<DashboardSalesGraph isLoading={isLoading} />
					</Grid>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
};

export default Dashboard;
