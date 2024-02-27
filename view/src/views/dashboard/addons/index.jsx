import Loader from "ui-component/Loader";

const { default: PopularCard } = require("ui-component/cards/Skeleton/PopularCard");
const { default: ProductPlaceholder } = require("ui-component/cards/Skeleton/ProductPlaceholder");
const { default: TotalGrowthBarChart } = require("ui-component/cards/Skeleton/TotalGrowthBarChart");

const Addons = () => {
    return (
        <>
            one
            < TotalGrowthBarChart />
            two
            < ProductPlaceholder />
            three
            < PopularCard />
        </>
    );
}

export default Addons;