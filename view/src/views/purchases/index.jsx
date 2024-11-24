import React, { useState, useEffect } from 'react';
import {
    Paper,
} from "@mui/material";

import { fetchAllUserActions } from '../../apiActions/allApiCalls/userActions';
import { LoadingSpinner } from '../../ui-component/loaderAPI';

export default function Purchases(){
    const [loading, setLoading] = useState(false);
    const [allActions, setAllActions] = useState([]);

    useEffect(() => {
        fetchData();
        // FormatDate(allActions);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await fetchAllUserActions();
            setTimeout(() => {
                setAllActions(data);
                setLoading(false);
            }, 500);
        }
        catch (error) {
            setLoading(false);
        }
    }

    return(
        <>
            {
            loading ?
                <LoadingSpinner /> :
                <>
                    <Paper>
                        {JSON.stringify(allActions)}
                    </Paper>
                </>
            }
        </>
    );
}
