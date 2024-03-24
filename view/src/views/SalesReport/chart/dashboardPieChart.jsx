import AppCurrentVisits from "./pieChart";

const DashBoardPieChart = () => {
    return (<>
        <AppCurrentVisits
            title="Current Visits"
            chart={{
                series: [
                    { label: 'America', value: 4344 },
                    { label: 'Asia', value: 5435 },
                    { label: 'Europe', value: 1443 },
                    { label: 'Africa', value: 4443 },
                ],
            }}
        />
    </>);
}

export default DashBoardPieChart;