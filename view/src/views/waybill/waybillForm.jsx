const WaybillForm = ({ formData }) => {
    return (
        <div className="waybill-form">
            <h1>Invoice Waybill</h1>
            {formData ? (
                <>
                    <p><strong>Invoice Number:</strong> {formData.InvoiceNumber}</p>
                    <p><strong>Customer Name:</strong> {formData.CustomerName}</p>
                    <p><strong>Customer TIN:</strong> {formData.CustomerTIN}</p>
                    <p><strong>Customer Phone:</strong> {formData.customerPhone}</p>
                    {formData.products && formData.products.length > 0 && (
                        <>
                            <h2>Products</h2>
                            <ul>
                                {formData.products.map((product, index) => (
                                    <li key={index}>
                                        <p><strong>Product Name:</strong> {product.ProductName}</p>
                                        <p><strong>Quantity:</strong> {product.Quantity}</p>
                                        <p><strong>Item Code:</strong> {product.itemCode}</p>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    <pre>{JSON.stringify(formData, null, 2)}</pre>
                </>
            ) : (
                <p>TIN Unavailable</p>
            )}
        </div>
    );
}

export default WaybillForm;