import logo from "../../assets/images/logo.webp"

// /* eslint-disable */
const InvoiceTemplate = ({ data }) => {

	return (
		<div>
			<table align="center" border={0} width='100%' cellPadding={8}>
				<tr>
					<td><h1>{data.InvoiceStatus === "Invoice" ? "Official Invoice" : data.InvoiceStatus}</h1></td>
					<td><img src={logo} width={65} height={50} alt="Logo"/></td>
				</tr>
			</table>
			<table cellSpacing="2" cellPadding="2" align="left" width="100%">
				<thead style={{ alignContent: 'start' }}>
					<tr>
						<td><strong>BILL TO:</strong></td>
						<td><strong>PAYABLE FOR:</strong></td>
						<td><strong>INVOICE #:</strong></td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{data.CustomerName}</td>
						<td>WAREHOUSE GHANA</td>
						<td>{data.InvoiceNumber}</td>
					</tr>
					<tr>
						<td>{data.CustomerTIN}</td>
						<td><strong>SERVED BY: </strong></td>
						<td><strong>DATE: </strong></td>
					</tr>
					<tr>
						<td>{data.customerPhone}</td>
						<td>{data.IssuerName}</td>
						<td>{data.InvoiceDate}</td>
					</tr>
				</tbody>
			</table>

			<table width='100%' border={0}>
				<tr/>
			</table>

			{
				Array.isArray(data.products) && data.products.length > 0 ?
					(
						<table border="1" cellSpacing="0" cellPadding="4" width="100%">
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
										<td>{product.ProductName}</td>
										<td>{product.uom}</td>
										<td>{product.ProductPrice}</td>
										<td>{product.Quantity}</td>
										<td>{(product.Quantity) * (product.ProductPrice)}</td>
									</tr>
								))}
							</tbody>
						</table>
					) :
					(<div>Products not available</div>)
			}

			<table cellSpacing="0" cellPadding="4" align="right">
				<thead>
					<tr>
						<td>GROSS</td>
						<td>{data.Currency}: {(data.TotalAmount)}</td>
					</tr>
					<tr>
						<td>DISCOUNT</td>
						<td>{data.Currency}: {data.InvoiceDiscount}</td>
					</tr>
					<tr>
						<td>GETFUND (2.5%)</td>
						<td>{data.Currency}: {data.GETFund}</td>
					</tr>
					<tr>
						<td>NHIL (2.5%)</td>
						<td>{data.Currency}: {data.NHIL}</td>
					</tr>
					<tr>
						<td>COVID (1%)</td>
						<td>{data.Currency}: {data.COVID}</td>
					</tr>
					{data.CST ?
						(<>
							<tr>
								<td>CST (5%)</td>
								<td>{data.Currency}: {data.CST}</td>
							</tr>
						</>) : null
					}
					{data.tourism ?
						(<>
							<tr>
								<td>TOURISM (1%)</td>
								<td>{data.Currency}: {data.Tourism}</td>
							</tr>
						</>) : null
					}
					<tr>
						<td>VAT (15%)</td>
						<td>{data.Currency}: {data.VatAmount}</td>
					</tr>
					<tr>
						<td>NET TOTAL</td>
						<td>{data.Currency}: {((data.TotalAmount) - (data.InvoiceDiscount))}</td>
					</tr>
					< br />
					{data.DeliveryFee ? 
						(<>
							< br />
							< br />
							<tr>
								<td>DELIVERY:</td>
								<td>{data.DeliveryFee === 'Free' ? null : `${data.Currency}:`} {(data.DeliveryFee)}</td>
							</tr>
						</>):
						(<></>)
					}
				</thead>
			</table>
			<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
			{
				data.QRCode && data.YSDCID ?<>
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

			<br />
			<hr />
			<br />

			<span>
				<div style={{ textDecoration: "underline" }}>TERMS & CONDITIONS</div>
				<li> Leads time usually takes 2 - 12 hours</li>
				<li>Return items are accepted for exchange or swapping</li>
				<li>Products supplied are not accepted after three working days of receipient</li>
				<li> All checks and payments are payable to JN-AKWETER ENTERPRISE.</li>
			</span>
			<p />

			<br />
			<br />
			<br />
			<br />
			<center>
				<small>
					<strong>
						{data.remarks}
						</strong>
				</small>
			</center>

		</div>
	);
}

export default InvoiceTemplate;
