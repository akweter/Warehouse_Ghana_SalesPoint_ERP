import { useEffect } from 'react';
import axios from 'axios';
import { bcndOrigin, } from 'auth/origins';

/* eslint-disable */

export default function VerifyToken() {
    useEffect(() => {
        SendToken();
    }, []);
    
    const SendToken = async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const userParam = urlParams.get('key');
 
            if (userParam) {
                await axios.get(`${bcndOrigin}/activate?key=${userParam}`)
                .then((response)=>{
                    const t = response.headers.get('Authorization');
                    const result  = response.data;
                    if (result.statusMessage === 'successActivate') {
                        sessionStorage.setItem('userInfo', JSON.stringify(response.data.data));
                        sessionStorage.setItem('usrlogstat', '200');
                        sessionStorage.setItem('Authorization', t);
                        if (result.data.connect === 'test') {
                            window.location.href = `${viewOrigin}/auth/verify/${result.data.accountId}`;
                        }
                        else {
                            window.location.href = `${viewOrigin}`;
                        }
                    }
                    else {
                        alert(result.message);
                        return window.location.href='/auth/login';
                    }
                })
                .catch(()=>{
                    return null;
                });
            }
            else {
                alert('Please log in again');
                return;
            }
        }
        catch (error) {
            alert('error');
            return;
        }
    }
}
