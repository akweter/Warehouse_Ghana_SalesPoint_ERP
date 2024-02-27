// import QRCode from "qrcode.react";
import logo from "../../assets/images/logo.webp"

const InvoiceTemplate = ({ data }) => {

	return (
		<div>
			<table align="center" border={0} width='100%' cellPadding={8}>
				<tr>
					<td><h1>Invoice</h1></td>
					<td><img src={logo} width={65} height={50} /></td>
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
						<td>{data.customerName}</td>
						<td>WAREHOUSE GHANA</td>
						<td>{data.Inv_Number}</td>
					</tr>
					<tr>
						<td>{data.Inv_Customer_Tin}</td>
						<td><strong>SERVED BY: </strong></td>
						<td><strong>DATE: </strong></td>
					</tr>
					<tr>
						<td>{data.customerPhone}</td>
						<td>{data.Inv_user}</td>
						<td>{data.Inv_date}</td>
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
										<td>{product.name}</td>
										<td>{product.uom}</td>
										<td>{product.price}</td>
										<td>{product.quantity}</td>
										<td>{(product.quantity) * (product.price)}</td>
									</tr>
								))}
							</tbody>
						</table>
					) :
					(<div>Products not available</div>)
			}

			<table bgcolor="#F9F9F9" cellSpacing="0" cellPadding="4" align="right">
				<thead>
					<tr>
						<td><strong>Subtotal:</strong></td>
						<td>{data.currency}: {(data.Inv_total_amt)}</td>
					</tr>
					<tr>
						<td><strong>Discount:</strong></td>
						<td>{data.currency}: {data.Inv_discount}</td>
					</tr>
					<tr>
						<td><strong>GetFund (2.5%)</strong></td>
						<td>{data.currency}: {data.getfund}</td>
					</tr>
					<tr>
						<td><strong>NHIL (2.5%)</strong></td>
						<td>{data.currency}: {data.nhil}</td>
					</tr>
					<tr>
						<td><strong>Covid (1%)</strong></td>
						<td>{data.currency}: {data.covid}</td>
					</tr>
					{data.tourism === null || data.tourism === undefined || data.tourism === "" ?
						(<></>) :
						(<>
							<tr>
								<td><strong>Tourism (1%)</strong></td>
								<td>{data.currency}: {data.tourism}</td>
							</tr>
						</>)
					}
					<tr>
						<td><strong>VAT (15%)</strong></td>
						<td>{data.currency}: {data.Inv_vat}</td>
					</tr>
					<tr>
						<td><strong>Total Amount:</strong></td>
						<td>{data.currency}: {((data.Inv_total_amt) - (data.Inv_discount))}</td>
					</tr>
					< br />
					{data.Inv_delivery_fee === null || data.Inv_delivery_fee === undefined || data.Inv_delivery_fee === "" || data.Inv_delivery_fee === 0 ?
						(<></>) :
						(<>
							< br />
							< br />
							<tr>
								<td><strong>Delivery:</strong></td>
								<td>{data.currency}: {(data.Inv_delivery_fee)}</td>
							</tr>
						</>)
					}
				</thead>
			</table>

			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />

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
						<td>{data.ysdcid}</td>
						<td rowSpan="7">
							<img src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data.qr_code)}`} alt="qr code" width={160} height={160} />
						</td>
					</tr>
					<tr>
						<td>Item Count:</td>
						<td>{data.products.length}</td>
					</tr>

					<tr>
						<td>Rceipt Number:</td>
						<td>{data.ysdcrecnum}</td>
					</tr>
					<tr>
						<td>Timestamp:</td>
						<td>{data.ysdctime}</td>
					</tr>
					<tr>
						<td>MRC</td>
						<td>{data.ysdcmrc}</td>
					</tr>
					<tr>
						<td>Internal Data:</td>
						<td>{data.ysdcintdata}</td>
					</tr>
					<tr>
						<td>Signature</td>
						<td>{data.ysdcregsig}</td>
					</tr>
				</tbody>
			</table>

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
							{/* &#42;&#42;&#42; This is computer generated invoice. Signature or stamp is not required &#42;&#42;&#42; */}
						</strong>
				</small>
			</center>

		</div>
	);
}

export default InvoiceTemplate;
