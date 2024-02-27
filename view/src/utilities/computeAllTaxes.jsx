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
    else if(itemCategory === "EXM"){
        levyAmountA = levyAmountB = levyAmountC = levyAmountD = levyAmountE = totalVat = totalLevy = "";
    }
    else if(itemCategory === "TRSM"){
        const graValueTRSM = itemSubtotal / 1.229;
        
        levyAmountA = levyAmountB = (2.5 / 100) * graValueTRSM;
        levyAmountC = (1 / 100) * graValueTRSM;
        levyAmountD = "";
        levyAmountE = (1 / 100) * graValueTRSM;
        vatableAmt = graValueTRSM + levyAmountA + levyAmountB + levyAmountC;
        totalVat = (15 / 100) * vatableAmt;
        totalLevy = levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
    }
    else if(itemCategory === "CST"){
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
            levyAmountA = levyAmountB = (2.5 / 100) *  itemSubtotal;
            levyAmountC = (1 / 100) * itemSubtotal;
            levyAmountD = levyAmountE = "";
            vatableAmt = itemSubtotal + levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
            totalVat = 0.15 * vatableAmt;
            totalLevy = levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
        }
        else if(itemCategory === "EXM"){
            levyAmountA = levyAmountB = levyAmountC = levyAmountD = levyAmountE = totalVat = totalLevy = "";
        }
        else if(itemCategory === "TRSM"){
            levyAmountA = levyAmountB = (2.5 / 100) * itemSubtotal;
            levyAmountC = (1 / 100) * itemSubtotal;
            levyAmountD = "";
            levyAmountE = (1 / 100) * itemSubtotal;
            vatableAmt = itemSubtotal + levyAmountA + levyAmountB + levyAmountC;
            totalVat = 0.15 * vatableAmt;
            totalLevy = levyAmountA + levyAmountB + levyAmountC + levyAmountE;
        }
        else if(itemCategory === "CST"){
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

// Return product Subtotal
const handleDiscountSubtotal = (header, items) => {
    const { discountType } = header;
    const { quantity, unitPrice, discountAmount } = items;
    let itemSubtotal;

    if (discountType === "GENERAL") {
        itemSubtotal = (quantity * unitPrice)  - discountAmount;
        return itemSubtotal;
    } else if (discountType === "SELECTIVE"){
        itemSubtotal = (quantity * unitPrice);
        return itemSubtotal;
    } else{
        return (quantity * unitPrice) - discountAmount;
    }
}

// handle refund inclusive tax scenario
export const handleRefundInclusiveTaxes = (itemlists, setItemLists, header) => {
    if (Array.isArray(itemlists) || itemlists !== undefined && itemlists.length > 0){
        setItemLists((prevLists) => {
            return itemlists.map((item) => {
                const { quantity, unitPrice, itemCategory, discountAmount } = item;
                if (quantity <= 0 || quantity === undefined || quantity === "") {
                    return item;
                }
                const itemSubtotal = handleDiscountSubtotal(header, item);
        
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
                else if(itemCategory === "EXM"){
                    levyAmountA = levyAmountB = levyAmountC = levyAmountD = levyAmountE = totalVat = totalLevy = "";
                }
                else if(itemCategory === "TRSM"){
                    const graValueTRSM = itemSubtotal / 1.229;
                    
                    levyAmountA = levyAmountB = (2.5 / 100) * graValueTRSM;
                    levyAmountC = (1 / 100) * graValueTRSM;
                    levyAmountD = "";
                    levyAmountE = (1 / 100) * graValueTRSM;
                    vatableAmt = graValueTRSM + levyAmountA + levyAmountB + levyAmountC;
                    totalVat = (15 / 100) * vatableAmt;
                    totalLevy = levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
                }
                else if(itemCategory === "CST"){
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
                };
            });
        });
    }
};

// handle refund exclusive tax scenario
export const handleRefundExclusiveTaxes = (itemlists, setItemLists, header) => {
    if (Array.isArray(itemlists) || itemlists !== undefined && itemlists.length > 0){
        setItemLists((prevLists) => {
            return itemlists.map((item) => {
                const { quantity, unitPrice, itemCategory, discountAmount } = item;
                if (quantity <= 0 || quantity === undefined || quantity === "") {
                    return item;
                }
                const itemSubtotal = handleDiscountSubtotal(header, item);
        
                // const graValue = itemSubtotal / 1.219;
                let levyAmountA, levyAmountB, levyAmountC, levyAmountD, levyAmountE, totalLevy, totalVat, vatableAmt;
                
                if (itemCategory === "") {
                    levyAmountA = levyAmountB = (2.5 / 100) *  itemSubtotal;
                    levyAmountC = (1 / 100) * itemSubtotal;
                    levyAmountD = levyAmountE = "";
                    vatableAmt = itemSubtotal + levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
                    totalVat = 0.15 * vatableAmt;
                    totalLevy = levyAmountA + levyAmountB + levyAmountC + levyAmountD + levyAmountE;
                }
                else if(itemCategory === "EXM"){
                    levyAmountA = levyAmountB = levyAmountC = levyAmountD = levyAmountE = totalVat = totalLevy = "";
                }
                else if(itemCategory === "TRSM"){
                    levyAmountA = levyAmountB = (2.5 / 100) * itemSubtotal;
                    levyAmountC = (1 / 100) * itemSubtotal;
                    levyAmountD = "";
                    levyAmountE = (1 / 100) * itemSubtotal;
                    vatableAmt = itemSubtotal + levyAmountA + levyAmountB + levyAmountC;
                    totalVat = 0.15 * vatableAmt;
                    totalLevy = levyAmountA + levyAmountB + levyAmountC + levyAmountE;
                }
                else if(itemCategory === "CST"){
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
                levyAmountA: twoDP(levyAmountA),
                levyAmountB: twoDP(levyAmountB),
                levyAmountC: twoDP(levyAmountC),
                levyAmountD: twoDP(levyAmountD),
                levyAmountE: twoDP(levyAmountE),
                totalLevy: twoDP(totalLevy),
                totalVat: twoDP(totalVat),
                itemSubtotal: twoDP(itemSubtotal - discountAmount),
                totalAmount: twoDP(quantity * unitPrice),
                };
            });
        });
    }
};

// compute Refund total taxes
// export const computeRefundFinalTaxes = (items, setHeader) => {
//     if (Array.isArray(items) || items !== undefined && items.length > 0){
//         const totalLevy = items.reduce((total, item) =>
//         total +
//         parseFloat(item.levyAmountA || 0) +
//         parseFloat(item.levyAmountB || 0) +
//         parseFloat(item.levyAmountC || 0) +
//         parseFloat(item.levyAmountD || 0) +
//         parseFloat(item.levyAmountE || 0),
//         0);

//         const totalVat = items.reduce(
//         (total, item) => total + parseFloat(item.totalVat || 0), 0);

//         const totalAmount = items.reduce(
//         (total, item) => total + parseFloat(item.totalAmount || 0), 0);

//         const voucherAmount = items.reduce(
//         (total, item) => total + parseFloat(item.voucherAmount || 0), 0);

//         const discountAmount = items.reduce(
//         (total, item) => total + parseFloat(item.discountAmount || 0), 0);

//         setHeader((header) => ({
//             ...header,
//             totalLevy: totalLevy.toFixed(2),
//             totalVat: totalVat.toFixed(2),
//             totalAmount: totalAmount.toFixed(2),
//             voucherAmount: voucherAmount.toFixed(2),
//             discountAmount: (discountAmount).toFixed(2),
//             items: items,
//         }));
//     }
// }
