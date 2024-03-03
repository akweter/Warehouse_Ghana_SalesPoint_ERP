import logo from '../assets/images/logo.webp';
import '../assets/css/verifyEmail.css';

function ShowEmail() {
    return (
        <div className='body'>
            <div className='imageSection'>
                <a href='/'><img src={logo} alt="Warehouse Ghana Logo" width="50" /> </a><i>Warehouse Ghana</i>
            </div>
            <div className='paragraph'>
                <h1>Registration Successful</h1>
                <p>Your account has successfully been added to the big family.</p>
                <div id='linkCard'>
                    <h2 className='linkCardHeader'>Verify Your Email</h2>
                    <p className='linkCardBody'>A verification link has been sent to your email. Please follow the link and activate your account.</p>
                    <p id='checkSpam'>Check spam folder in case you do not find it.</p>
                </div>
            </div>
        </div>
    );
}

export default ShowEmail;