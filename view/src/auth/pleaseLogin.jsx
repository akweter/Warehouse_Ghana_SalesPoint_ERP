import logo from '../assets/images/logo.webp';
import '../assets/css/verifyEmail.css';

function PleaseLogin() {
    return (
        <div className='body'>
            <div className='imageSection'>
                <img src={logo} alt="Warehouse Ghana Logo" width="50" /> <i>Warehouse Ghana</i>
            </div>
            <p className='paragraph'>
                <h1>Registration Successful</h1>
                <p>Your account has successfully been created with Warehouse Ghana but not activated.</p>
                <div id='linkCard'>
                    <h2 className='linkCardHeader'>Verify Your Email</h2>
                    <p className='linkCardBody'>A verification link has been sent to your email. Please follow the link and activate your account.</p>
                    <p id='checkSpam'>Check spam folder in case you do not find it.</p>
                </div>
            </p>
        </div>
    );
}

export default PleaseLogin;