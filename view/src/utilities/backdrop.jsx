import { CircularProgress, Backdrop, } from '@mui/material';

export const ShowBackDrop = ({open}) =>{
    return(
        <div>
            <Backdrop color='secondary' sx={{zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
                <CircularProgress size={35} color="inherit" />
            </Backdrop>
        </div>
    );
}
