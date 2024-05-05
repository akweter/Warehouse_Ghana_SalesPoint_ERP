import { useState } from 'react';
import { Search } from "@mui/icons-material";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    TextField,
} from "@mui/material";
import { verifyTIN } from 'apiActions/allApiCalls/invoice';

// Define SmallTextField outside of VerifyTIN component
export const SmallTextField = ({ setData, label, handleVerification }) => (<>
    <TextField
        id="filled-search"
        label={label}
        type="search"
        variant="outlined"
        size='small'
        sx={{ '& .MuiInputBase-input': { py: '8px' } }}
        onChange={(e) => setData(e.target.value)}
    />
    <IconButton size='small' onClick={handleVerification}>
        <Search />
    </IconButton>
</>);

const VerifyTIN = () => {
    const [data, setData] = useState("");
    const [res, setRes] = useState([]);
    const [open, setOpen] = useState(false);

    const handleVerification = async () => {
        try {
            const result = await verifyTIN(data);
            setRes(result);
            setOpen(true);
        }
        catch (error) {
            setRes([]);
        }
    }

    return (
        <>
            <SmallTextField setData={setData} label={'Verify TIN'} handleVerification={handleVerification}/>
            <Dialog open={open} sx={{ padding: '20px' }} onClose={() => setOpen(false)}>
                <DialogTitle color='darkred' variant='h3'>Result</DialogTitle>
                <DialogContent>
                    <Paper>
                        <pre>{JSON.stringify(res, null, 2) || 'TIN Unavailable'}</pre>
                    </Paper>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default VerifyTIN;
