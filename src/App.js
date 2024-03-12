import React, {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import api, {getTokens, refreshTokens} from './services/api';

function App() {
    const [clientId, setClientId] = useState(localStorage.getItem('clientId') || '');
    const [clientSecret, setClientSecret] = useState(localStorage.getItem('clientSecret') || '');
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
    const [code, setCode] = useState(localStorage.getItem('code') || '');
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');

    const [dateStart, setDateStart] = useState('2024-02-12');
    const [dateEnd, setDateEnd] = useState('2024-03-12');
    const [dailyActivities, setDailyActivities] = useState([]);

    const handleDateStartChange = (e) => {
        setDateStart(e.target.value);
    };

    const handleDateEndChange = (e) => {
        setDateEnd(e.target.value);
    };

    const handleGetInfo = async () => {
        try {
            const response = await api.get(`/parser/info?date_start=${dateStart}&date_end=${dateEnd}&user_id=${userId}&access_token=${accessToken}`);
            setDailyActivities(response.data.data.daily_activities);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const codeParam = urlParams.get('code');
        if (codeParam) {
            setCode(codeParam);
            localStorage.setItem('code', codeParam);
        }
    }, []);

    const handleClientIdChange = (e) => {
        setClientId(e.target.value);
        localStorage.setItem('clientId', e.target.value);
    };

    const handleClientSecretChange = (e) => {
        setClientSecret(e.target.value);
        localStorage.setItem('clientSecret', e.target.value);
    };

    const handleGetTokens = async (code) => {
        try {
            const response = await getTokens(clientId, clientSecret, code);
            setAccessToken(response.data.data.access_token);
            setRefreshToken(response.data.data.refresh_token);
            setUserId(response.data.data.user_id);
            localStorage.setItem('accessToken', response.data.data.access_token);
            localStorage.setItem('refreshToken', response.data.data.refresh_token);
            localStorage.setItem('userId', response.data.data.user_id);
        } catch (error) {
            console.error('Error getting tokens:', error);
        }
    };

    const handleRefreshTokens = async () => {
        try {
            const response = await refreshTokens(clientId, clientSecret, refreshToken);
            setAccessToken(response.data.data.access_token);
            localStorage.setItem('accessToken', response.data.data.access_token);
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };

    const handleGetCode = () => {
        const redirectUri = encodeURIComponent(window.location.origin);
        const state = 'yes';
        const authUrl = `https://developer.mypacer.com/oauth2/dialog?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
        window.location.href = authUrl;
    };

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', margin: 2}}>
            <TextField
                label="Client ID"
                value={clientId}
                onChange={handleClientIdChange}
                margin="normal"
            />
            <TextField
                label="Client Secret"
                value={clientSecret}
                onChange={handleClientSecretChange}
                margin="normal"
            />
            <TextField
                disabled
                label="User ID"
                value={userId}
                margin="normal"
                InputProps={{
                    readOnly: true,
                }}
            />
            <Button variant="contained" onClick={handleGetCode} sx={{marginTop: 2}}>
                Get Code
            </Button>
            <TextField
                disabled
                label="Code"
                value={code}
                margin="normal"
                InputProps={{
                    readOnly: true,
                }}
            />
            <Button variant="contained" onClick={() => handleGetTokens(code)} sx={{marginTop: 2}}>
                Get Access Token
            </Button>
            <TextField
                disabled
                label="Access Token"
                value={accessToken}
                margin="normal"
                InputProps={{
                    readOnly: true,
                }}
            />
            <Button variant="contained" onClick={handleRefreshTokens} sx={{marginTop: 2}}>
                Refresh Access Token
            </Button>
            <TextField
                disabled
                label="Refresh Token"
                value={refreshToken}
                margin="normal"
                InputProps={{
                    readOnly: true,
                }}
            />

            <TextField
                type="date"
                label="Start Date"
                value={dateStart}
                onChange={handleDateStartChange}
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                type="date"
                label="End Date"
                value={dateEnd}
                onChange={handleDateEndChange}
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
            />

            <Button variant="contained" onClick={handleGetInfo} sx={{marginTop: 2}}>
                Get Info
            </Button>

            {dailyActivities.length > 0 && (
                <Box sx={{marginTop: 2}}>
                    {dailyActivities.map((activity, index) => (
                        <Box key={index} sx={{marginBottom: 1, border: '1px solid #ccc', padding: 2}}>
                            <div>Date: {activity.recorded_for_date}</div>
                            <div>Steps: {activity.steps}</div>
                            <div>Total Distance: {activity.total_distance} meters</div>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default App;
