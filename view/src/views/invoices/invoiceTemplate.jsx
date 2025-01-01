import logo from "../../assets/images/logo.webp"
import signature from "../../assets/images/signature.jpg"

// /* eslint-disable */
const InvoiceTemplate = ({ data }) => {

	const sortedProducts = data.products.slice().sort((a, b) => {
		if (a.ProductName < b.ProductName) return -1;
		if (a.ProductName > b.ProductName) return 1;
		return 0;
	});

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
						<h1>
							{data.InvoiceStatus === "Invoice" ? "Official Invoice" : "Official Invoice"}
							{/* {data.InvoiceStatus.charAt(0).toUpperCase() + data.InvoiceStatus.slice(1) || "Official Invoice"} */}
						</h1>
					</td>
					<td><img src={logo} width={100} height={85} alt="Logo" /></td>
				</tr>
			</table>

			<table cellSpacing="2" cellPadding="2" align="left" width="100%">
				<thead style={{ alignContent: 'start' }}>
					<tr>
						<td><strong>CUSTOMER</strong></td>
						<td><strong>SUPPLIER</strong></td>
						<td><strong>INVOICE #</strong></td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{data.CustomerName || "CASH"}</td>
						<td>JN-AKWETER ENTERPRISE</td>
						<td>{data.InvoiceNumber}</td>
					</tr>
					<tr>
						<td>{data.CustomerTIN === "C0000000000" ? data.customerPhone : data.CustomerTIN}</td>
						<td>P0030588901</td>
						<td>{data.InvoiceDate}</td>
					</tr>
					<tr>
						<td>{data.CustomerTIN === "C0000000000" ? null : data.customerPhone}</td>
						<td />
						<td></td>
					</tr>
				</tbody>
			</table>

			{/* display products */}

			<table width='100%' border={0}>
				{
					Array.isArray(data.products) && data.products.length > 0 ?
						(
							<table border="1" cellSpacing="0" cellPadding="4" width="100%" color="lightgray">
								<thead>
									<tr>
										<th>DESCRIPTION</th>
										<th>UOM</th>
										<th>QTY</th>
										<th>PRICE</th>
										<th>TOTAL</th>
									</tr>
								</thead>
								<tbody>
									{sortedProducts.map((product, index) => (
										<tr key={index}>
											<td>{product.ProductName}</td>
											<td align="center">{product.uom}</td>
											<td align="center">{product.Quantity}</td>
											<td align="center">{Number(product.ProductPrice).toFixed(2)}</td>
											<td align="center">{Number((product.Quantity) * (product.ProductPrice)).toFixed(2)}</td>
										</tr>
									))}
								</tbody>
							</table>
						) :
						(<div>Products unavailable</div>)
				}
			</table>

			{/* Display VAT & Levies */}

			<table cellSpacing="0" cellPadding="4" width="100%">
				<thead>
					{
						Number(data.TotalAmount) !== Number(data.TotalAmount - data.InvoiceDiscount) ?
							<tr>
								<td width="60%" />
								<td width="20%" align="left">GROSS</td>
								<td width="20%" >{data.Currency}: {Number(data.TotalAmount)}</td>
							</tr> : null
					}
					{
						Number(data.InvoiceDiscount) ?
							<tr>
								<td width="60%" />
								<td width="20%" align="left">DISCOUNT</td>
								<td width="20%" >{data.Currency}: {Number(data.InvoiceDiscount)}</td>
							</tr> : null
					}
					{data.showVAT || data.showVAT === "no" ? <></> : <>
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
						{Number(data.CST) ?
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
					</>}
					<tr style={{ border: "12px" }}>
						<td width="60%" />
						<td width="20%" align="left"><strong>NET TOTAL</strong></td>
						<td width="20%">
							<strong>
								{
									data.CalculationType === "EXCLUSIVE" ?
										data.Currency + ":" + ((
											Number(data.TotalAmount) +
											Number(data.VatAmount) +
											Number(data.CST) +
											Number(data.Tourism) +
											Number(data.GETFund) +
											Number(data.NHIL)
										) - data.InvoiceDiscount).toFixed(2) :
										data.Currency + ": " + (
											Number(data.TotalAmount - data.InvoiceDiscount)
										).toFixed(2)
								}
							</strong>
						</td>
					</tr>
					{data.DeliveryFee ?
						(<tr>
							<td width="60%" />
							<td width="20%" align="left"><i><small>SHIPPING:</small></i></td>
							<td width="20%">
								<small>{
									isNaN(data.DeliveryFee) ?
										<i>{data.DeliveryFee}</i> :
										<i>{data.Currency}: {(data.DeliveryFee)}</i>
								}</small>
							</td>
						</tr>) :
						(<></>)
					}
				</thead>
			</table>

			{data.showVAT || data.showVAT === "no" ? <> < br /> < br /> < br /> < br /> </> : null}

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
				{/* 
				<span>
					<div style={{ textDecoration: "underline" }}>Guidelines & Agreements</div>
					<li> Leads time usually takes 2 - 12 hours</li>
					<li>All checks and payments are payable to our accounts below.</li>
				</span> */}

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
						<td>GHANA COMMERCIAL BANK</td>
						<td><strong>MERCHANT </strong></td>
						<td align="center">EBO JACKSON</td>
					</tr>
					<tr>
						<td><strong>NUMBER</strong></td>
						<td>1011180004579</td>
						<td>858824</td>
						<td align="center">Accounts</td>
					</tr>
					<tr>
						<td><strong>NAME</strong></td>
						<td>JN-AKWETER ENTERPRISE</td>
						<td>0598598809</td>
						<td align="center" rowSpan={2}><img src={signature} alt="" /></td>
					</tr>
					<tr>
						<td><strong>BRANCH</strong></td>
						<td>ACCRA HIGH STREET</td>
						<td>MTN</td>
					</tr>
				</table>

				<small style={{ position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center" }}>
					<strong>
						{data.remarks ? data.remarks : `**This is electronic invoice. Stamp not required**`}{/*data.InvoiceStatus*/}
					</strong>
				</small>
			</table>
		</div>
	);
}

export default InvoiceTemplate;
