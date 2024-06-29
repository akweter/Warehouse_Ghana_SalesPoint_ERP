// GRA Item payload structure
export const itemlistPayload = {
    itemCode: "",
    itemCategory: "",
    expireDate: "",
    description: "",
    quantity: "",
    levyAmountA: "",
    levyAmountB: "",
    levyAmountC: "",
    levyAmountD: "",
    levyAmountE: "",
    discountAmount: 0.00,
    batchCode: "",
    unitPrice: "",
    itemSubtotal: "",
    totalVat: "",
    totalLevy: "",
    totalAmount: "",
    alt: '',
    refProQty: '',
}

// GRA header payload structure
export const headerPayload = {
    increment: "",
    currency: "GHS",
    exchangeRate: "1.0",
    invoiceNumber: "",
    totalLevy: "",
    userName: "",
    flag: "INVOICE",
    calculationType: "INCLUSIVE",
    totalVat: "",
    transactionDate: "",
    totalAmount: "",
    voucherAmount: "",
    businessPartnerName: "Walk-In Customer",
    businessPartnerTin: "C0000000000",
    saleType: "NORMAL",
    discountType: "GENERAL",
    discountAmount: "",
    reference: "",
    groupReferenceId: "",
    purchaseOrderReference: "",
    items: [],
    invCusId: "",
    remarks: "Thank you for choosing us.",
    invoiceType: "Invoice",
    delivery: "",
}
