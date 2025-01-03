import { Button } from "@mui/material";
import LogOut from "./logout";

const styles = {
    body: {
        justifyContent: 'space-around',
        textAlign: 'center',
        margin: '0 20%',
        
    },    
    paragraph: {
        margintop: '7%'
    },    
    linkCard: {
        padding: '3%',
        border: '2px solid darkblue',
        display: 'inline-block',
        background: '#dcf3f97d',
        borderRadius: '20px',
        textAlign: 'justify',
        textJustify: "distribute",
        width: '100%',
        height: '100%'
    },
    checkSpam: {
        color: 'red',
    },
}

 const ForbiddenPage = () =>{
    return (
        <div style={styles.body}>
            <div style={styles.paragraph}>
                <h2 style={{textAlign: 'center'}}>User Activity Timeout</h2>
                <div style={styles.linkCard}>
                    <h3 className='linkCardBody'>Oops! Your authorization is invoked</h3>
                    <p>Please <Button variant="outlined" size="small" color="error" onClick={LogOut}>Click here</Button> to log in again</p>
                </div>
            </div>
        </div>
    );
}

export default ForbiddenPage;
