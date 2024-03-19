import React, { useState, useEffect } from 'react';
import { 
    List,
    ListItemText, 
    Collapse, 
    ListItemButton,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fetchRefundCancelledInvoices } from 'apiActions/allApiCalls/refund';

/* eslint-disable */
const DemoPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
}));

const DrawerContent = () => {
    const [show, setShow] = useState([]);
    const [data, setData] = useState([]);
    const [alert, setAlert]= useState({message: '', color: 'success'});

    useEffect(() => {
        fetchRefundCancelledInvoices()
            .then((result) => {
                    if (Array.isArray(result) && result.length > 0) {
                        setData(result);
                        setShow(new Array(result.length).fill(false));
                    } else {
                        setData([]);
                    }
                })
            .catch(() => {
                setTimeout(() => {
                    setAlert((e) => ({...e, message: `Something unexpected happened with\n your connection or server interrupted. \n\n Please log in again if it persists.`, color: 'error'}));
                }, 2000);
            });
    }, []);

    const handleClick = (index) => {
        setShow((prevStates) => {
            const newStates = [...prevStates];
            newStates[index] = !newStates[index];
            return newStates;
        });
    };

    return (
        <Stack direction="row">
            <DemoPaper variant="outlined" sx={{width: 350}}>
                <Typography variant='h4' color="darkred" align='center' borderBottom={1}>Cancel Refund Transactions</Typography>
                {
                    Array.isArray(data) && data.length > 0 ? 
                    (data.map((inv, index) => (
                        <List key={index} dense sx={{ width: '100%', margin: 0, padding: 0 }}>
                            <ListItemButton dense onClick={() => handleClick(index)} sx={{ margin: 0, padding: 0 }}>
                                <ListItemText primary="Invoice Number" secondary={inv.Inv_Number} />
                                {show[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ListItemButton>
                            <Collapse in={show[index]} timeout="auto" unmountOnExit>
                                <List dense component="div" disablePadding>
                                    <ListItemButton dense sx={{ pl: 2, margin: 0, }}>
                                        <ListItemText primary="Refund Reference" secondary={inv.Inv_Reference}/>
                                    </ListItemButton>
                                </List>
                            </Collapse>
                        </List>
                    ))): 
                    (<Typography variant='h4' sx={{padding: 3}}>Data unavailable</Typography>)
                }
            </DemoPaper>
        </Stack>
    );
};

export default DrawerContent;
