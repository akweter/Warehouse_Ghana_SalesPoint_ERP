import { Chip } from '@mui/material';
import React, { useEffect, useState } from 'react';

export function DateTimeSecondsDisplay(){
    const [formattedDateTime, setFormattedDateTime] = useState('');
  
    const getFormattedDateTime = () => {
      const options = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      };
  
      const currentDate = new Date();
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);
      const daySuffix = (() => {
        const day = currentDate.getDate();
        if (day >= 11 && day <= 13) {
          return 'th';
        }
        switch (day % 10) {
          case 1:
            return 'st';
          case 2:
            return 'nd';
          case 3:
            return 'rd';
          default:
            return 'th';
        }
      })();
  
      const formattedDateTimeWithSuffix = formattedDate.replace(/(\d+)(th|st|nd|rd)/, `$1${daySuffix}`);
      return formattedDateTimeWithSuffix;
    };
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setFormattedDateTime(getFormattedDateTime());
      }, 1000);
      return () => clearInterval(intervalId);
    }, []);
  
    return (
      <div>
        <Chip label={formattedDateTime} color="primary" variant="outlined" size='medium'/>
      </div>
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

export const FormattedDate = () =>{
  useEffect(()=>{
    const Dat = new Date();
    const FormattedDate = `${Dat.getFullYear()}-${(Dat.getMonth() + 1).toString().padStart(2, '0')}-${Dat.getDate().toString().padStart(2, '0')}`;
    return FormattedDate;
  },[]);
}