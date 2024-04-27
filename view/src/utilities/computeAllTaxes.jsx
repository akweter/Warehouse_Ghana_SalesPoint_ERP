// /* eslint-disable */

const DiscountType = (item, header) => {
    const { discountType } = header;
    const { quantity, unitPrice, discountAmount } = item;
    return discountType === 'GENERAL' ? (quantity * unitPrice) - discountAmount : (quantity * unitPrice);
};

// handle refund inclusive tax scenario
export const InclusiveTax = (item, header) => {
    if (item && header) {
        const { quantity, unitPrice, discountAmount, itemCategory } = item;
        if (!quantity || !unitPrice) { return item; }
        const itemSubtotal = DiscountType(item, header);

        const graValue = itemSubtotal / 1.219;
        let levyAmountA, levyAmountB, levyAmountC, levyAmountD, levyAmountE, totalLevy, totalVat, vatableAmt;

        if (itemCategory === "") {
            levyAmountA = levyAmountB = (2.5 / 100) * graValue;
            levyAmountC = (1 / 100) * graValue;
            levyAmountD = levyAmountE = "";
            vatableAmt = graValue + levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
            totalVat = 0.15 * vatableAmt;
            totalLevy = levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
        }
        else if (itemCategory === "EXM") {
            levyAmountA = levyAmountB = levyAmountC = levyAmountD = levyAmountE = totalVat = totalLevy = "";
        }
        else if (itemCategory === "TRSM") {
            const graValueTRSM = itemSubtotal / 1.229;

            levyAmountA = levyAmountB = (2.5 / 100) * graValueTRSM;
            levyAmountC = (1 / 100) * graValueTRSM;
            levyAmountD = "";
            levyAmountE = (1 / 100) * graValueTRSM;
            vatableAmt = graValueTRSM + levyAmountA + levyAmountB + levyAmountC;
            totalVat = (15 / 100) * vatableAmt;
            totalLevy = levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
        }
        else if (itemCategory === "CST") {
            const graValueCST = itemSubtotal / 1.2765;

            levyAmountA = levyAmountB = (2.5 / 100) * graValueCST;
            levyAmountC = (1 / 100) * graValueCST;
            levyAmountD = (5 / 100) * graValueCST;
            levyAmountE = "";
            vatableAmt = graValueCST + levyAmountA + levyAmountB + levyAmountC + levyAmountD;
            totalVat = (15 / 100) * vatableAmt;
            totalLevy = levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
        }
        return {
            ...item,
            levyAmountA: levyAmountA,
            levyAmountB: levyAmountB,
            levyAmountC: levyAmountC,
            levyAmountD: levyAmountD,
            levyAmountE: levyAmountE,
            totalLevy: totalLevy,
            totalVat: totalVat,
            totalAmount: (quantity * unitPrice),
            discountAmount: discountAmount,
        };
    }
};

// handle refund exclusive tax scenario
export const ExclusiveTax = (item, header) => {
    if (item && header) {
        const { quantity, unitPrice, itemCategory, discountAmount } = item;
        if (!quantity || !unitPrice) { return item; }
        const itemSubtotal = DiscountType(item, header);

        // const graValue = itemSubtotal / 1.219;
        let levyAmountA, levyAmountB, levyAmountC, levyAmountD, levyAmountE, totalLevy, totalVat, vatableAmt;

        if (itemCategory === "") {
            levyAmountA = levyAmountB = (2.5 / 100) * itemSubtotal;
            levyAmountC = (1 / 100) * itemSubtotal;
            levyAmountD = levyAmountE = "";
            vatableAmt = itemSubtotal + levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
            totalVat = 0.15 * vatableAmt;
            totalLevy = levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
        }
        else if (itemCategory === "EXM") {
            levyAmountA = levyAmountB = levyAmountC = levyAmountD = levyAmountE = totalVat = totalLevy = "";
        }
        else if (itemCategory === "TRSM") {
            levyAmountA = levyAmountB = (2.5 / 100) * itemSubtotal;
            levyAmountC = (1 / 100) * itemSubtotal;
            levyAmountD = "";
            levyAmountE = (1 / 100) * itemSubtotal;
            vatableAmt = itemSubtotal + levyAmountA + levyAmountB + levyAmountC;
            totalVat = 0.15 * vatableAmt;
            totalLevy = levyAmountA + levyAmountB + levyAmountC + levyAmountE;
        }
        else if (itemCategory === "CST") {
            levyAmountA = levyAmountB = (2.5 / 100) * itemSubtotal;
            levyAmountC = (1 / 100) * itemSubtotal;
            levyAmountD = (5 / 100) * itemSubtotal;
            levyAmountE = "";
            vatableAmt = itemSubtotal + levyAmountA + levyAmountB + levyAmountC + levyAmountD;
            totalVat = (15 / 100) * vatableAmt;
            totalLevy = levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
        }
        return {
            ...item,
            levyAmountA: levyAmountA,
            levyAmountB: levyAmountB,
            levyAmountC: levyAmountC,
            levyAmountD: levyAmountD,
            levyAmountE: levyAmountE,
            totalLevy: totalLevy,
            totalVat: totalVat,
            totalAmount: quantity * unitPrice,
            discountAmount: discountAmount,
        };
    }
};

// handle compute total refund
export const computeStandardTaxes = (header) => {
    const { calculationType, items } = header;
    const updatedItems =  calculationType === 'EXCLUSIVE' ? items.map(item => ExclusiveTax(item, header)) : items.map(item => InclusiveTax(item, header));

    const totalLevy = updatedItems.reduce((total, item) =>
        total +
        parseFloat(item.levyAmountA || 0) +
        parseFloat(item.levyAmountB || 0) +
        parseFloat(item.levyAmountC || 0) +
        parseFloat(item.levyAmountD || 0) +
        parseFloat(item.levyAmountE || 0),
        0);

    const totalVat = updatedItems.reduce((total, item) => total + parseFloat(item.totalVat || 0), 0);
    const totalAmount = updatedItems.reduce((total, item) => total + parseFloat(item.totalAmount || 0), 0);
    const voucherAmount = updatedItems.reduce((total, item) => total + parseFloat(item.voucherAmount || 0), 0);
    const discountAmount = updatedItems.reduce((total, item) => total + parseFloat(item.discountAmount || 0), 0);
    const nhil = updatedItems.reduce((total, item) => total + parseFloat(item.levyAmountA || 0), 0);
    const getfund = updatedItems.reduce((total, item) => total + parseFloat(item.levyAmountB || 0), 0);
    const covid = updatedItems.reduce((total, item) => total + parseFloat(item.levyAmountC || 0), 0);
    const cst = updatedItems.reduce((total, item) => total + parseFloat(item.levyAmountD || 0), 0);
    const tourism = updatedItems.reduce((total, item) => total + parseFloat(item.levyAmountE || 0), 0);
    
    const setHeader = {
        totalLevy: totalLevy.toFixed(2),
        totalVat: totalVat.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        voucherAmount: voucherAmount.toFixed(2),
        discountAmount: (discountAmount).toFixed(2),
        nhil: nhil.toFixed(2),
        getfund: getfund.toFixed(2),
        covid: covid.toFixed(2),
        cst: cst === 0 ? 0.00 : cst.toFixed(2),
        tourism: tourism === 0 ? 0.00 : tourism.toFixed(2),
        items: updatedItems,
    }
    return setHeader;
}
