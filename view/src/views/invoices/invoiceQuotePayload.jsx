import { computeStandardTaxes } from 'utilities/computeAllTaxes';
import { getUserName } from 'utilities/getUserName';

export const useFullPayload = (payload) => {
    
    // Set Date value according to GRA API standard
    const formatDate = (date) => {
        if (date) {
            const parts = date.split('/');
            const formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            return formattedDate;
        }
    }

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
        invCusId: CustomerTIN,
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
    };
    return newHeader;
}
