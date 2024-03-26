import React, { useState, useEffect } from 'react';
import AppWebsiteVisits from "./barChart";
import { fetchAllThisMonthDailyInvoiceAmount } from 'apiActions/allApiCalls/invoice';

const DashboardBarChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const invoicesData = await fetchAllThisMonthDailyInvoiceAmount();
            setData(invoicesData);
        } catch (error) {
            return null;
        }
    };

    const labels = data.map(item => {
        const date = new Date(item.Date);
        const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    });
    const invoices = data.map(item => item.invoiceList.split(',').length);
    const totalSales = data.map(item => parseFloat(item.totalAmount));
    const profit = data.map(item => parseFloat(item.Dailyprofit));

    return (
        <AppWebsiteVisits
            title="This Month"
            subheader="Sales Review"
            chart={{
                labels: labels,
                series: [
                    {
                        name: 'Invoices',
                        type: 'column',
                        fill: 'solid',
                        data: invoices,
                    },
                    {
                        name: 'Total Sales',
                        type: 'area',
                        fill: 'gradient',
                        data: totalSales,
                    },
                    {
                        name: 'Profit',
                        type: 'line',
                        fill: 'solid',
                        data: profit,
                    },
                ],
            }}
        />
    );
}

export default DashboardBarChart;