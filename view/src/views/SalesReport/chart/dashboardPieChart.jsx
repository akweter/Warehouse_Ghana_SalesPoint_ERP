import { useState, useEffect } from 'react';
import AppCurrentVisits from "./pieChart";
import { fetchAllThisMonthTaxes } from 'apiActions/allApiCalls/invoice';
import ProductPlaceholder from 'ui-component/cards/Skeleton/ProductPlaceholder';

const DashBoardPieChart = () => {
    const [taxes, setTaxes] = useState([]);

    useEffect(() => {
        MonthlyTaxes();
    }, []);

    const MonthlyTaxes = async () => {
        try {
            const taxes = await fetchAllThisMonthTaxes();
            setTaxes(taxes);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {
                taxes.length > 0 ?
                    <AppCurrentVisits
                        title="THIS MONTH TAXES"
                        chart={{
                            series: [
                                { label: 'VAT', value: parseFloat(taxes[0].totalVat) },
                                { label: 'GetFund', value: parseFloat(taxes[0].totalGetfund) },
                                { label: 'NHIL', value: parseFloat(taxes[0].totalNHIL) },
                                { label: 'CST', value: parseFloat(taxes[0].totalCST) },
                                { label: 'Covid', value: parseFloat(taxes[0].totalCovid) },
                                { label: 'Tourism', value: parseFloat(taxes[0].totalTourism) },
                            ],
                        }}
                    /> :
                    <ProductPlaceholder />
            }
        </>
    );
}

export default DashBoardPieChart;