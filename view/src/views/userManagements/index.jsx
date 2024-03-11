import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    Grid,
    Paper,
} from "@mui/material";

// Projects
import { fetchAllUsers } from 'apiActions/allApiCalls/users';
import DisplayUsers from './displayUsers';
import AddNewSystemUser from './addNewUser';
import { LoadingSpinner } from 'ui-component/loaderAPI';

const UserManagerment = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [open, setOpen] = useState(false);
    const [allusers, setAllusers] = useState([]);

    useEffect(() => {
        fetchData();
        FormatDate(allusers);
    }, [submitted]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await fetchAllUsers();
            setTimeout(() => {
                setAllusers(data);
                setLoading(false);
            }, 1500);
        }
        catch (error) {
            setLoading(false);
        }
    }

    const FormatDate = (data) => {
        if (data > 0) {
            const { Usr_reg_date } = data;
            const dateObject = new Date(Usr_reg_date);
            const formattedDate = `${dateObject.getFullYear()} ${(dateObject.getMonth() + 1).toString().padStart(2, '0')} ${dateObject.getDate().toString().padStart(2, '0')}`;
            setAllusers((state) => ({ ...state, Usr_reg_date: formattedDate }));
        }
    }

    const handleOpen = () => { setOpen(true) }
    const handleClose = () => { setOpen(false) }

    return (<>
        {
            loading ?
            <LoadingSpinner /> :
            <>
                <Paper>
                    <Grid container sx={{ justifyContent: 'space-around', paddingBottom: 1 }}>
                        <Button
                            variant='contained'
                            color='primary'
                            size='medium'
                            onClick={handleOpen}
                        >
                            Add New User
                        </Button>
                    </Grid>
                    <Box>
                        {allusers.length > 0 ? (
                            <DisplayUsers inData={allusers} addUser={open} closeAddnewUser={handleClose} submission={setSubmitted}/>
                        ) :
                            null}
                    </Box>
                </Paper>
                <Dialog open={open}>
                    <AddNewSystemUser closeAddnewUser={handleClose} setSubmitted={setSubmitted} />
                </Dialog>
            </>
        }
    </>);
}

export default UserManagerment;
