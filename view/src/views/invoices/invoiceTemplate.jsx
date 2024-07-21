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
						<h1>{data[0].InvoiceStatus === "Invoice" ? "Official Invoice" : "Official Invoice"}{/*data[0].InvoiceStatus}</h1>*/}</h1>
					</td>
					<td><img src={logo} width={100} height={85} alt="Logo" /></td>
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
						<td>{data[0].CustomerName}</td>
						<td>JN-AKWETER ENTERPRISE</td>
						<td>{data[0].InvoiceNumber}</td>
					</tr>
					<tr>
						<td>{data[0].CustomerTIN === "C0000000000" ? data[0].customerPhone : data[0].CustomerTIN}</td>
						<td>P0030588901</td>
						<td><strong>DATE</strong></td>
					</tr>
					<tr>
						<td>{data[0].CustomerTIN === "C0000000000" ? null : data[0].customerPhone}</td>
						<td />
						<td>{data[0].InvoiceDate}</td>
					</tr>
				</tbody>
			</table>

			{/* display products */}

			<table width='100%' border={0}>
				{
					Array.isArray(data[0].products) && data[0].products.length > 0 ?
						(
							<table border="1" cellSpacing="0" cellPadding="4" width="100%" color="lightgray">
								<thead>
									<tr>
										<th>Description</th>
										<th>UOM</th>
										<th>Qty</th>
										<th>Price</th>
										<th>Total</th>
									</tr>
								</thead>
								<tbody>
									{data[0].products.map((product, index) => (
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
						(<div>Products not available</div>)
				}
			</table>

			{/* Display VAT & Levies */}

			<table cellSpacing="0" cellPadding="4" width="100%">
				<thead>
					{
						Number(data[0].TotalAmount) !== Number(data[0].TotalAmount - data[0].InvoiceDiscount) ? 
						<tr>
							<td width="60%" />
							<td width="20%" align="left">GROSS</td>
							<td width="20%" >{data[0].Currency}: {Number(data[0].TotalAmount)}</td>
						</tr> : null
					}
					{
						isNaN(data[0].InvoiceDiscount) ?
						<tr>
							<td width="60%" />
							<td width="20%" align="left">DISCOUNT</td>
							<td width="20%" >{data[0].Currency}: {Number(data[0].InvoiceDiscount)}</td>
						</tr> : null
					}
					{data[0].showVAT || data[0].showVAT === "no" ? <></>: <>
						<tr>
							<td width="60%" />
							<td width="20%" align="left">GETFUND (2.5%)</td>
							<td width="20%" >{data[0].Currency}: {data[0].GETFund}</td>
						</tr>
						<tr>
							<td width="60%" />
							<td width="20%" align="justify">NHIL (2.5%)</td>
							<td width="20%">{data[0].Currency}: {data[0].NHIL}</td>
						</tr>
						<tr>
							<td width="60%" />
							<td width="20%" align="left">COVID (1%)</td>
							<td width="20%" >{data[0].Currency}: {data[0].COVID}</td>
						</tr>
						{data[0].CST ?
							(<tr>
								<td width="60%" />
								<td width="20%" align="left">CST (5%)</td>
								<td width="20%" >{data[0].Currency}: {data[0].CST}</td>
							</tr>) : null
						}
						{data[0].tourism ?
							(<tr>
								<td width="60%" />
								<td width="20%" align="left">TOURISM (1%)</td>
								<td width="20%" >{data[0].Currency}: {data[0].Tourism}</td>
							</tr>) : null
						}
						<tr>
							<td width="60%" />
							<td width="20%" align="left">VAT (15%)</td>
							<td width="20%" >{data[0].Currency}: {data[0].VatAmount}</td>
						</tr>
					</>}
					<tr style={{ border: "12px" }}>
						<td width="60%" />
						<td width="20%" align="left"><strong>NET TOTAL</strong></td>
						<td width="20%">
							<strong>
								{
									data[0].CalculationType === "EXCLUSIVE" ?
									data[0].Currency+":"+ ((
										Number(data[0].TotalAmount) + 
										Number(data[0].VatAmount) + 
										Number(data[0].CST) + 
										Number(data[0].Tourism) + 
										Number(data[0].GETFund) + 
										Number(data[0].NHIL)
									) - data[0].InvoiceDiscount).toFixed(2) :
									data[0].Currency+": "+ (
										Number(data[0].TotalAmount - data[0].InvoiceDiscount)
									).toFixed(2)
								}
							</strong>
						</td>
					</tr>
					{data[0].DeliveryFee ?
						(<tr>
							<td width="60%" />
							<td width="20%" align="left">DELIVERY:</td>
							<td width="20%">{isNaN(data[0].DeliveryFee) ? <>{data[0].DeliveryFee}</> : <>{data[0].Currency}: {(data[0].DeliveryFee)}</>}</td>
						</tr>) :
						(<></>)
					}
				</thead>
			</table>
			
			{data[0].showVAT || data[0].showVAT === "no" ? <> < br/> < br/> < br/> < br/> </> : null }
			
			<table >
				{
					data[0].QRCode && data[0].YSDCID ? <>
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
									<td>{data[0].YSDCID}</td>
									<td rowSpan="7">
										<img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data[0].QRCode)}`} alt="qr code" width={160} height={160} />
									</td>
								</tr>
								<tr>
									<td>Item Count:</td>
									<td>{data[0].products.length}</td>
								</tr>

								<tr>
									<td>Rceipt Number:</td>
									<td>{data[0].YSDCRecNum}</td>
								</tr>
								<tr>
									<td>Timestamp:</td>
									<td>{data[0].YSDCMRCTime}</td>
								</tr>
								<tr>
									<td>MRC</td>
									<td>{data[0].YSDCMRC}</td>
								</tr>
								<tr>
									<td>Internal Data:</td>
									<td>{data[0].YSDCIntData}</td>
								</tr>
								<tr>
									<td>Signature</td>
									<td>{data[0].YSDCRegSig}</td>
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
						{data[0].remarks ? data[0].remarks : `**This is a computer-generated invoice. Stamp not required**`}{/*data[0].InvoiceStatus*/}
					</strong>
				</small>
			</table>
		</div>
	);
}

export default InvoiceTemplate;
