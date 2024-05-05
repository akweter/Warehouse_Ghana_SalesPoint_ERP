const WaybillForm = ({formData}) => {
    return(<>
        <h1>Hello Waybill</h1>
        <pre>{JSON.stringify(formData, null, 2) || 'TIN Unavailable'}</pre>
    </>);
}

export default WaybillForm;