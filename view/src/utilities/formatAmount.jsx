export const formatCurrencyNumber = (num) => {
    if (num >= 1e12) {
        const roundedNum = (Math.round(num / 1e9) / 1000).toFixed(2);
        return `${roundedNum}T`;
    } else if (num >= 1e9) {
        const roundedNum = (Math.round(num / 1e6) / 1000).toFixed(2);
        return `${roundedNum}B`;
    } else if (num >= 1e6) {
        const roundedNum = (Math.round(num / 1e3) / 1000).toFixed(2);
        return `${roundedNum}M`;
    } else if (num >= 1000) {
        const roundedNum = (Math.round(num / 100) / 10).toFixed(2);
        return `${roundedNum}K`;
    } else {
        return Number(num).toFixed(2);
    }
};
