import { computeStandardTaxes } from '../../utilities/computeAllTaxes';
import { formatDate } from '../../utilities/formatDate';
import { getUserName } from '../../utilities/getUserName';

export const UseFullPayload = (payload) => {
    // update the header and item state
    const {
        CustomerTIN,
        InvoiceNumber,
        ExchangeRate,
        Currency,
        CalculationType,
        CustomerName,
        products,
        Remarks,
        SaleType,
        DiscountType,
        InvoiceDate,
        CustomerID,
        checkdID,
    } = payload;

    // Set items state
    const itemslist = (data) => {
        if (Array.isArray(data) && data.length > 0) {
            const updatedItemLists = data.map((e) => {
                return {
                    itemCode: e.itemCode,
                    itemCategory: e.ProductCategory,
                    expireDate: "",
                    description: e.ProductName,
                    quantity: e.Quantity,
                    levyAmountA: "",
                    levyAmountB: "",
                    levyAmountC: "",
                    levyAmountD: "",
                    levyAmountE: "",
                    discountAmount: e.ProductDiscount,
                    batchCode: "",
                    unitPrice: e.ProductPrice,
                    itemSubtotal: "",
                    totalVat: "",
                    totalLevy: "",
                    totalAmount: "",
                    alt: "",
                    refProQty: e.RefundedQuantity,
                };
            });
            return updatedItemLists;
        }
    }
    // Set header state
    const header = { calculationType: CalculationType, discountType: DiscountType, items: itemslist(products) };

    const result = computeStandardTaxes(header);
    const {
        covid,
        discountAmount,
        totalAmount,
        totalLevy,
        voucherAmount,
        cst,
        getfund,
        items,
        nhil,
        totalVat,
        tourism,
    } = result;

    const newHeader = {
        currency: Currency,
        exchangeRate: ExchangeRate,
        invoiceNumber: InvoiceNumber,
        totalLevy: totalLevy,
        userName: getUserName(),
        flag: "INVOICE",
        calculationType: CalculationType,
        totalVat: totalVat,
        transactionDate: formatDate(InvoiceDate),
        totalAmount: totalAmount,
        voucherAmount: voucherAmount,
        businessPartnerName: CustomerName,
        businessPartnerTin: CustomerTIN,
        saleType: SaleType,
        discountType: DiscountType,
        discountAmount: discountAmount,
        reference: "",
        groupReferenceId: "",
        purchaseOrderReference: "",
        invCusId: CustomerID,
        remarks: Remarks,
        status: "Invoice",
        quote: "Yes",
        cst: cst,
        getfund: getfund,
        items: items,
        nhil: nhil,
        tourism: tourism,
        covid: covid,
        invoiceType: "Invoice",
        checkdID: checkdID,
    };
    return newHeader;
}
