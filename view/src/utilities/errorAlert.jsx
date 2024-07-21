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

export const AlertError = ({ alert, open, handleClose }) => {
    return (
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

export const GeneralCatchError = ({ alert, open, handleClose }) => {
    return (<>
        <ShowBackDrop open={open} />
        <Snackbar
            open={open}
            // autoHideDuration={8000}
            onClose={handleClose}
            TransitionComponent={Slide}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transitionDuration={2000}
        >
            <Card sx={{ minWidth: 350, minHeight: 200, backgroundColor: '#EA9282' }}>
                <CardContent sx={{ backgroundColor: '#F0F0F0' }}>
                    <Typography variant='h3' color='darkred'>Temporal Network Error!</Typography>
                    <Typography sx={{ fontSize: 14, paddingTop: 3, whiteSpace: 'pre-line' }}>
                        {alert.message}
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                    <Button size="medium" color='secondary' variant='contained' onClick={() => window.location.reload()}>Refresh</Button>
                    <Button size="medium" color='warning' variant='contained' onClick={() => window.location.href = "/auth/logout" }>Log In Again</Button>
                </CardActions>
            </Card>
        </Snackbar>
    </>);
}
