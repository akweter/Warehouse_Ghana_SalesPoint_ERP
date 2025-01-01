import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

export function DateTimeSecondsDisplay() {
    const [formattedDateTime, setFormattedDateTime] = useState('');

    const getFormattedDateTime = () => {
        const currentDate = new Date();

        // Extract individual components
        const weekday = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const isPM = hours >= 12;
        
        const formattedHour = (hours % 12 || 12).toString();
        const period = isPM ? 'PM' : 'AM';
        return `${weekday}, ${month}/${day}/${year}, ${formattedHour}:${minutes}:${seconds} ${period}`;
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setFormattedDateTime(getFormattedDateTime());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Typography color="darkblue" variant="h4" sx={{ textWrap: 'wrap' }}>
            {formattedDateTime}
        </Typography>
    );
}

export function GreetUser() {
    const [greeting, setGreeting] = useState('');
    const currentHour = new Date().getUTCHours();

    useEffect(() => {
        if (currentHour >= 0 && currentHour < 12) {
            setGreeting('Good Morning');
        } else if (currentHour >= 12 && currentHour < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }
    }, [currentHour]);

    return (
        <>{greeting}</>
    );
}

export const FormattedDate = () => {
    useEffect(() => {
        const Dat = new Date();
        return(`${Dat.getFullYear()}-${(Dat.getMonth() + 1).toString().padStart(2, '0')}-${Dat.getDate().toString().padStart(2, '0')}`);
    }, []);
}