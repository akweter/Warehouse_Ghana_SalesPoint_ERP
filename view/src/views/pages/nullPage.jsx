import { Link } from "react-router-dom";

export default function NullPage() {
    return(
        <div>
            <div style={{paddingTop: '5%', textAlign: 'center'}} className="container mt-4">
                <h1>Oops!</h1>
                <p style={{color: 'red'}}>We couldn't found the page you are looing for.</p>
                <Link to={'/'} className="btn btn-lg fw-bold btn-primary m-4">Dashboard</Link>
            </div>
        </div>
    );
}
