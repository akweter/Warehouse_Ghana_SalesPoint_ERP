import logo from "../../assets/images/logo.webp"
import signature from "../../assets/images/signature.jpg"

// /* eslint-disable */
const InvoiceTemplate = ({ data }) => {

	return (
		<div>
			<table align="center" border={0} width='100%' cellPadding={8}>
				<tr>
					<td>
						<big style={{ fontSize: 23 }}>
							Warehouse Ghana
						</big>
						<address>
							www.warehouseghana.com <br />
							sales@warehouseghana.com <br />
							+233 (0) 245152082
						</address>
					</td>
					<td><img src={logo} width={80} height={65} alt="Logo" /></td>
				</tr>
				<tr>
					{/* <td><h1>{data.InvoiceStatus === "Invoice" ? "Official Invoice" : data.InvoiceStatus}</h1></td> */}
					<td><h1>Official Invoice</h1></td>
				</tr>
			</table>

			<table cellSpacing="2" cellPadding="2" align="left" width="100%">
				<thead style={{ alignContent: 'start' }}>
					<tr>
						<td><strong>BILL TO</strong></td>
						<td><strong>PAYABLE TO</strong></td>
						<td><strong>INVOICE #</strong></td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{data.CustomerName}</td>
						<td>JN-AKWETER ENTERPRISE</td>
						<td>{data.InvoiceNumber}</td>
					</tr>
					<tr>
						<td>{data.CustomerTIN}</td>
						<td>P0030588901</td>
						<td><strong>DATE</strong></td>
					</tr>
					<tr>
						<td>{data.customerPhone}</td>
						<td />
						<td>{data.InvoiceDate}</td>
					</tr>
				</tbody>
			</table>

			<table width='100%' border={0}>
				{
					Array.isArray(data.products) && data.products.length > 0 ?
						(
							<table border="1" cellSpacing="0" cellPadding="4" width="100%" color="lightgray">
								<thead>
									<tr>
										<th>Product/Service</th>
										<th>UOM</th>
										<th>Qty</th>
										<th>Unit Price</th>
										<th>Total Price</th>
									</tr>
								</thead>
								<tbody>
									{data.products.map((product, index) => (
										<tr key={index}>
											<td align="center">{product.ProductName}</td>
											<td align="center">{product.uom}</td>
											<td align="center">{product.ProductPrice}</td>
											<td align="center">{product.Quantity}</td>
											<td align="center">{(product.Quantity) * (product.ProductPrice)}</td>
										</tr>
									))}
								</tbody>
							</table>
						) :
						(<div>Products not available</div>)
				}
			</table>

			<table cellSpacing="0" cellPadding="4" width="100%">
				<thead>
					<tr>
						<td width="60%" />
						<td width="20%" align="left">GROSS</td>
						<td width="20%" >{data.Currency}: {(data.TotalAmount)}</td>
					</tr>
					<tr>
						<td width="60%" />
						<td width="20%" align="left">DISCOUNT</td>
						<td width="20%" >{data.Currency}: {data.InvoiceDiscount}</td>
					</tr>
					<tr>
						<td width="60%" />
						<td width="20%" align="left">GETFUND (2.5%)</td>
						<td width="20%" >{data.Currency}: {data.GETFund}</td>
					</tr>
					<tr>
						<td width="60%" />
						<td width="20%" align="justify">NHIL (2.5%)</td>
						<td width="20%">{data.Currency}: {data.NHIL}</td>
					</tr>
					<tr>
						<td width="60%" />
						<td width="20%" align="left">COVID (1%)</td>
						<td width="20%" >{data.Currency}: {data.COVID}</td>
					</tr>
					{data.CST ?
						(<tr>
							<td width="60%" />
							<td width="20%" align="left">CST (5%)</td>
							<td width="20%" >{data.Currency}: {data.CST}</td>
						</tr>) : null
					}
					{data.tourism ?
						(<tr>
							<td width="60%" />
							<td width="20%" align="left">TOURISM (1%)</td>
							<td width="20%" >{data.Currency}: {data.Tourism}</td>
						</tr>) : null
					}
					<tr>
						<td width="60%" />
						<td width="20%" align="left">VAT (15%)</td>
						<td width="20%" >{data.Currency}: {data.VatAmount}</td>
					</tr>
					<tr style={{ border: "12px" }}>
						<td width="60%" />
						<td width="20%" align="left"><strong>NET TOTAL</strong></td>
						<td width="20%"><strong>{data.Currency}: {((data.TotalAmount) - (data.InvoiceDiscount)).toFixed(2)}</strong></td>
					</tr>
					{data.DeliveryFee ?
						(<tr>
							<td width="60%" />
							<td width="20%" align="left">DELIVERY:</td>
							<td width="20%">{isNaN(data.DeliveryFee) ? <>{data.DeliveryFee}</> : <>{data.Currency}: {(data.DeliveryFee)}</>}</td>
						</tr>) :
						(<></>)
					}
				</thead>
			</table>

			<table >
				{
					data.QRCode && data.YSDCID ? <>
						<table cellSpacing="0" cellPadding="4" width="100%" align="left">
							<tbody>
								<tr>
									<td colSpan={3}>
										SDC INFORMATION
										<hr />
									</td>
								</tr>
								<tr>
									<td>SDC ID:</td>
									<td>{data.YSDCID}</td>
									<td rowSpan="7">
										<img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data.QRCode)}`} alt="qr code" width={160} height={160} />
									</td>
								</tr>
								<tr>
									<td>Item Count:</td>
									<td>{data.products.length}</td>
								</tr>

								<tr>
									<td>Rceipt Number:</td>
									<td>{data.YSDCRecNum}</td>
								</tr>
								<tr>
									<td>Timestamp:</td>
									<td>{data.YSDCMRCTime}</td>
								</tr>
								<tr>
									<td>MRC</td>
									<td>{data.YSDCMRC}</td>
								</tr>
								<tr>
									<td>Internal Data:</td>
									<td>{data.YSDCIntData}</td>
								</tr>
								<tr>
									<td>Signature</td>
									<td>{data.YSDCRegSig}</td>
								</tr>
							</tbody>
						</table>
					</> : null
				}

				<span>
					<div style={{ textDecoration: "underline" }}>Guidelines & Agreements</div>
					<li> Leads time usually takes 2 - 12 hours</li>
					<li>All checks and payments are payable to our accounts below.</li>
				</span>

				<p />
				<hr />
				<p />

				<table width="100%">
					<tr>
						<td colSpan={3} align="center">
							<strong style={{ textDecoration: "underline", textDecorationColor: "lightgray" }}>OFFICIAL PAYMENT DETAILS</strong>
						</td>
						<td align="center"><strong style={{ color: 'darkred' }}>Signed By</strong></td>
					</tr>
					<tr>
						<td><strong>BANK</strong></td>
						<td>Ghana Commercial Bank</td>
						<td><strong>MERCHANT </strong></td>
						<td align="center">Ebo Jackson</td>
					</tr>
					<tr>
						<td><strong>NUMBER</strong></td>
						<td>1011180004579</td>
						<td>858824</td>
						<td align="center">Accounts</td>
					</tr>
					<tr>
						<td><strong>NAME</strong></td>
						<td>JN-Akweter Enterprise</td>
						<td>0598598809</td>
						<td align="center" rowSpan={2}><img src={signature} alt="" /></td>
					</tr>
					<tr>
						<td><strong>BRANCH</strong></td>
						<td>Accra High Street</td>
						<td>MTN</td>
					</tr>
				</table>

				<small style={{ position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center" }}>
					<strong>
						{data.remarks ? data.remarks : `**This is a computer-generated ${data.InvoiceStatus}. Stamp not required**`}
					</strong>
				</small>
			</table>
		</div>
	);
}

export default InvoiceTemplate;
