import React from 'react';
import MuiAlert from '@mui/material/Alert';
import { 
    Snackbar, 
    Slide,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button
} from '@mui/material';
import { ShowBackDrop } from './backdrop';

export const AlertError = ({alert, open, handleClose}) =>{
    return(
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            TransitionComponent={Slide}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
            <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleClose}
                severity={alert.color}
            >
                {alert.message}
            </MuiAlert>
        </Snackbar>
    );
}

export const GeneralCatchError = ({alert, open, handleClose}) =>{
    return(<>
        <ShowBackDrop open={open}/>
        <Snackbar
            open={open}
            // autoHideDuration={8000}
            onClose={handleClose}
            TransitionComponent={Slide}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <MuiAlert
                elevation={6}
                variant="filled"
                // onClose={handleClose}
                severity={alert.color}
                sx={{
                    display: 'flex',
                    textAlign: 'center',
                    justifyContent: 'center'
                }}
            >
                <Card sx={{ minWidth: 350 , minHeight: 200}}>
                    <CardContent>
                        <Typography variant='h3' color='darkred'>Temporal Network Error!</Typography>
                        <Typography sx={{ fontSize: 16, paddingTop: 3, whiteSpace: 'pre-line' }}>
                            {alert.message}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{justifyContent: 'center'}}>
                        <Button size="medium" color='primary' variant='outlined' onClick={()=>{window.location.href="/auth/logout"}}>Log In Again</Button>
                        <Button size="medium" color='inherit' variant='contained' onClick={()=>{window.location.reload()}}>Refresh</Button>
                    </CardActions>
                </Card>
            </MuiAlert>
        </Snackbar>
    </>);
}
