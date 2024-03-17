/* eslint-disable */

// Round the values to two decimal place
function twoDP(value) {
    if (typeof value === 'number' && !isNaN(value)) {
        let roundedValue = Math.round(value * 100) / 100;
        return roundedValue;
    } else {
        return value;
    }
}

// Return product Subtotal
const handleDiscountSubtotal = (header, items) => {
    const { discountType } = header;
    const { quantity, unitPrice, discountAmount } = items;
    let itemSubtotal;

    if (discountType === "GENERAL") {
        itemSubtotal = (quantity * unitPrice) - discountAmount;
        return itemSubtotal;
    } else if (discountType === "SELECTIVE") {
        itemSubtotal = (quantity * unitPrice);
        return itemSubtotal;
    } else {
        return (quantity * unitPrice) - discountAmount;
    }
}

// handle Inclusive Tax scenario
export const handleInclusiveTaxes = (itemlists, setItemLists, handleDiscountSubtotal) => {
    const { quantity, unitPrice, itemCategory, discountAmount } = itemlists;
    const itemSubtotal = handleDiscountSubtotal;

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
    setItemLists((list) => ({
        ...list,
        levyAmountA: twoDP(levyAmountA),
        levyAmountB: twoDP(levyAmountB),
        levyAmountC: twoDP(levyAmountC),
        levyAmountD: twoDP(levyAmountD),
        levyAmountE: twoDP(levyAmountE),
        totalLevy: twoDP(totalLevy),
        totalVat: twoDP(totalVat),
        itemSubtotal: twoDP(itemSubtotal),
        totalAmount: twoDP(quantity * unitPrice),
        discountAmount: twoDP(discountAmount),
    }));
};

// handle Exclusive Tax Scenario
export const handleExclusiveTaxes = (itemlists, setItemLists, handleDiscountSubtotal) => {
    const { quantity, unitPrice, itemCategory, discountAmount } = itemlists;
    const itemSubtotal = handleDiscountSubtotal;

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

    setItemLists((list) => ({
        ...list,
        levyAmountA: twoDP(levyAmountA),
        levyAmountB: twoDP(levyAmountB),
        levyAmountC: twoDP(levyAmountC),
        levyAmountD: twoDP(levyAmountD),
        levyAmountE: twoDP(levyAmountE),
        totalLevy: twoDP(totalLevy),
        totalVat: twoDP(totalVat),
        itemSubtotal: twoDP(itemSubtotal - discountAmount),
        totalAmount: twoDP(quantity * unitPrice),
    }));
};

// Calculate Final Taxes
export const computeFinalTaxes = (items, setHeader, setTax) => {
    const totalLevy = items.reduce((total, item) =>
        total +
        parseFloat(item.levyAmountA || 0) +
        parseFloat(item.levyAmountB || 0) +
        parseFloat(item.levyAmountC || 0) +
        parseFloat(item.levyAmountD || 0) +
        parseFloat(item.levyAmountE || 0),
        0);

    const totalVat = items.reduce(
        (total, item) => total + parseFloat(item.totalVat || 0), 0);

    const subTotal = items.reduce(
        (total, item) => total + parseFloat(item.itemSubtotal || 0), 0);

    const totalAmount = items.reduce(
        (total, item) => total + parseFloat(item.totalAmount || 0), 0);

    const voucherAmount = items.reduce(
        (total, item) => total + parseFloat(item.voucherAmount || 0), 0);

    const discountAmount = items.reduce(
        (total, item) => total + parseFloat(item.discountAmount || 0), 0);

    const nhil = items.reduce(
        (total, item) => total + parseFloat(item.levyAmountA || 0), 0);

    const getfund = items.reduce(
        (total, item) => total + parseFloat(item.levyAmountB || 0), 0);

    const covid = items.reduce(
        (total, item) => total + parseFloat(item.levyAmountC || 0), 0);

    const cst = items.reduce(
        (total, item) => total + parseFloat(item.levyAmountD || 0), 0);

    const tourism = items.reduce(
        (total, item) => total + parseFloat(item.levyAmountE || 0), 0);

    setHeader((header) => ({
        ...header,
        totalLevy: totalLevy,
        totalVat: totalVat,
        totalAmount: totalAmount.toFixed(2),
        voucherAmount: voucherAmount.toFixed(2),
        discountAmount: (discountAmount).toFixed(2),
    }));

    setTax((prevTax) => ({
        ...prevTax,
        nhil: nhil.toFixed(2),
        getfund: getfund.toFixed(2),
        covid: covid.toFixed(2),
        cst: cst.toFixed(2),
        tourism: tourism.toFixed(2),
        Subtotal: subTotal.toFixed(2),
    }));
}

/**************************************************************************************** */
const handleDiscountSubtotalRef = (item, header) => {
    const { discountType } = header;
    const { quantity, unitPrice, discountAmount } = item;
    return discountType === 'GENERAL' ? (quantity * unitPrice) - discountAmount : (quantity * unitPrice);
};

// handle refund inclusive tax scenario
export const handleRefundInclusiveTaxes = (item, header) => {
    if (item && header) {
        const { quantity, unitPrice, discountAmount, itemCategory } = item;
        if (!quantity || !unitPrice) { return item; }
        const itemSubtotal = handleDiscountSubtotalRef(item, header);

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
export const handleRefundExclusiveTaxes = (item, header) => {
    if (item && header) {
        const { quantity, unitPrice, itemCategory, discountAmount } = item;
        if (!quantity || !unitPrice) { return item; }
        const itemSubtotal = handleDiscountSubtotalRef(item, header);

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
export const computeFinalRefTaxes = (itemlists, header, setHeader) => {
    const { calculationType } = header;

    const updatedItems = itemlists.map(item =>  calculationType === 'EXCLUSIVE' ? handleRefundExclusiveTaxes(item, header) : handleRefundInclusiveTaxes(item, header));

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

    setHeader((header) => ({
        ...header,
        totalLevy: totalLevy,
        totalVat: totalVat,
        totalAmount: totalAmount.toFixed(2),
        voucherAmount: voucherAmount.toFixed(2),
        discountAmount: (discountAmount).toFixed(2),
        items: updatedItems,
    }));
}

/************************************************************************************** */
// Levy rates
const LEVY_RATES = {
    A: 2.5 / 100,
    B: 2.5 / 100,
    C: 1 / 100,
    D: 5 / 100,
    E: 1 / 100,
};

// const handleTaxes = (items, isExclusive, header) => {
//     if (items) {
//       return items.map((item) => {
//         const { quantity, unitPrice, itemCategory, discountAmount } = item;
//         const itemSubtotal = handleDiscountSubtotalRef(item, header);
//         const graValue = isExclusive ? itemSubtotal : itemSubtotal / 1.219;

//         const levyAmountA = (itemCategory === "" || itemCategory === "TRSM" || itemCategory === "CST") ? LEVY_RATES.A * itemSubtotal : 0;
//         const levyAmountB = (itemCategory === "" || itemCategory === "TRSM" || itemCategory === "CST") ? LEVY_RATES.B * itemSubtotal : 0;
//         const levyAmountC = (itemCategory === "" || itemCategory === "TRSM" || itemCategory === "CST") ? LEVY_RATES.C * itemSubtotal : 0;
//         const levyAmountD = (itemCategory === "" || itemCategory === "TRSM" || itemCategory === "EXM") ? 0 : LEVY_RATES.D * itemSubtotal;
//         const levyAmountE = (itemCategory === "" || itemCategory === "CST" || itemCategory === "EXM") ? 0 : LEVY_RATES.E * itemSubtotal;

//         const levyAmount = levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
//         const totalVat = isExclusive ? 0.15 * (graValue + levyAmount) : 0.15 * (graValue / 1.15 + levyAmount);
//         const updatedItem = {
//           ...item,
//           levyAmountA,
//           levyAmountB,
//           levyAmountC,
//           levyAmountD,
//           levyAmountE,
//           totalLevy: levyAmount,
//           totalVat,
//           discountAmount: discountAmount,
//           totalAmount: (quantity * unitPrice),
//         };
//         return updatedItem;
//       });
//     }
//     return [];
// }

// const handleTaxes = (items, isExclusive, header) => {
//     if (items) {
//         return items.map((item) => {
//             const { quantity, unitPrice, itemCategory, discountAmount } = item;
//             const itemSubtotal = handleDiscountSubtotalRef(item, header);
//             const graValue = isExclusive ? itemSubtotal : (itemSubtotal / 1.219);

//             const levyAmountA = (itemCategory === "" || itemCategory === "TRSM" || itemCategory === "CST") ? LEVY_RATES.A * graValue : 0;
//             const levyAmountB = (itemCategory === "" || itemCategory === "TRSM" || itemCategory === "CST") ? LEVY_RATES.B * graValue : 0;
//             const levyAmountC = (itemCategory === "" || itemCategory === "TRSM" || itemCategory === "CST") ? LEVY_RATES.C * graValue : 0;
//             const levyAmountD = (itemCategory === "" || itemCategory === "TRSM" || itemCategory === "EXM") ? 0 : LEVY_RATES.D * graValue;
//             const levyAmountE = (itemCategory === "" || itemCategory === "CST" || itemCategory === "EXM") ? 0 : LEVY_RATES.E * graValue;

//             const levyAmount = levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
//             const totalVat = isExclusive ? 0.15 * (graValue + levyAmount) : 0.15 * (graValue / 1.15 + levyAmount);

//             const updatedItem = {
//                 ...item,
//                 levyAmountA,
//                 levyAmountB,
//                 levyAmountC,
//                 levyAmountD,
//                 levyAmountE,
//                 totalLevy: levyAmount,
//                 totalVat,
//                 discountAmount: discountAmount,
//                 totalAmount: (quantity * unitPrice),
//             };

//             return updatedItem;
//         });
//     }
//     return [];
// }

// compute general and selective discount

// Helper function for rounding to two decimal places


// Helper function for handling taxes
export const handleTaxes = (items, inclusive = true, header) => {
    const { quantity, unitPrice, itemCategory, discountAmount } = items;
    const itemSubtotal = handleDiscountSubtotalRef(items, header);

    const graValue = inclusive ? itemSubtotal / 1.219 : itemSubtotal;
    const vatRates = {
        "": { A: 2.5, B: 2.5, C: 1, D: 0, E: 0 },
        "TRSM": { A: 2.5, B: 2.5, C: 1, D: 0, E: 1 },
        "CST": { A: 2.5, B: 2.5, C: 1, D: 5, E: 0 }
    };

    const vatCategory = vatRates[itemCategory || ""] || { A: 0, B: 0, C: 0, D: 0, E: 0 };

    const graValueCategory = itemCategory === "TRSM" ? itemSubtotal / 1.229 : itemCategory === "CST" ? itemSubtotal / 1.2765 : graValue;

    const { A, B, C, D, E } = vatCategory;
    const levyAmountA = A / 100 * graValueCategory;
    const levyAmountB = B / 100 * graValueCategory;
    const levyAmountC = C / 100 * graValueCategory;
    const levyAmountD = D / 100 * graValueCategory;
    const levyAmountE = E / 100 * graValueCategory;

    const vatableAmt = graValueCategory + levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
    const totalVat = inclusive ? 0.15 * vatableAmt : 0;
    const totalLevy = levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;

    return {
        ...items,
        levyAmountA: (levyAmountA),
        levyAmountB: (levyAmountB),
        levyAmountC: (levyAmountC),
        levyAmountD: (levyAmountD),
        levyAmountE: (levyAmountE),
        totalLevy: (totalLevy),
        totalVat: (totalVat),
        itemSubtotal: (itemSubtotal),
        totalAmount: (quantity * unitPrice),
        discountAmount: (discountAmount),
    };
};

// Main function for performing computations
export const performComputations = (itemlists, header, setHeader) => {
    const { calculationType } = header;
    const inclusive = calculationType === 'INCLUSIVE';

    const updatedItems = itemlists.map(item => handleTaxes(item, inclusive, header));

    const computedValues = updatedItems.reduce((acc, item) => ({
        totalLevy: acc.totalLevy + parseFloat(item.totalLevy || 0),
        totalVat: acc.totalVat + parseFloat(item.totalVat || 0),
        totalAmount: acc.totalAmount + parseFloat(item.totalAmount || 0),
        discountAmount: acc.discountAmount + parseFloat(item.discountAmount || 0),
    }), { totalLevy: 0, totalVat: 0, totalAmount: 0, discountAmount: 0 });

    setHeader((state) => ({
        ...state,
        totalLevy: (computedValues.totalLevy).toFixed(2),
        totalVat: (computedValues.totalVat).toFixed(2),
        totalAmount: (computedValues.totalAmount).toFixed(2),
        discountAmount: (computedValues.discountAmount).toFixed(2),
        items: updatedItems,
    }));
};
