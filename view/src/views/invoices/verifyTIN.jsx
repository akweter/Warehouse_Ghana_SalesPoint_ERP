import { useState } from 'react';
import { Search } from "@mui/icons-material";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { verifyTIN } from 'apiActions/allApiCalls/invoice';

export const SmallTextField = ({ setData, label, handleVerification }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        await handleVerification();
        setLoading(false);
    };

    return (
        <>
            <TextField
                label={label}
                type="search"
                variant="outlined"
                size='small'
                sx={{ '& .MuiInputBase-input': { py: '8px' } }}
                onChange={(e) => setData(e.target.value)}
            />
            <IconButton size='small' onClick={handleClick}>
                {loading ? <CircularProgress size={23} /> : <Search />}
            </IconButton>
        </>
    );
}

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
            <SmallTextField setData={setData} label={'Verify TIN'} handleVerification={handleVerification} />
            <Dialog open={open} sx={{ padding: '20px' }} fullScreen>
                <DialogTitle>
                    <Button variant='outlined' color='error' onClick={() => setOpen(false)}>Close</Button>
                </DialogTitle>
                <DialogContent>
                    <Paper elevation={3}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <Typography variant='h3' color='darkred' textAlign='center'>Result</Typography>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {res && res.data ? (
                                        <>
                                            <TableRow>
                                                <TableCell>TIN</TableCell>
                                                <TableCell>{res.data.tin}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>BUSINESS TYPE</TableCell>
                                                <TableCell>{res.data.type}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>BUSINESS NAME</TableCell>
                                                <TableCell>{res.data.name}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>SECTOR</TableCell>
                                                <TableCell>{res.data.sector}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>BUSINESS ADDRESS</TableCell>
                                                <TableCell>{res.data.address}</TableCell>
                                            </TableRow>
                                        </>
                                    ) :
                                        <Typography variant='body1' align='center' padding={10}>No details found!</Typography>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default VerifyTIN;
