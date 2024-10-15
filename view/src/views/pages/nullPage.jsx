import { useNavigate } from 'react-router-dom';
import nullLogo from '../../assets/images/nullLogo.svg'
import {
    Box,
    Button,
    Container,
    Typography,
} from "@mui/material";

export default function NullPage() {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    return (
        <>
            <Container>
                <Box
                    sx={{
                        py: 10,
                        maxWidth: 480,
                        mx: 'auto',
                        display: 'flex',
                        minHeight: '60vh',
                        textAlign: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h3" sx={{ mb: 3 }}>
                        Sorry, page not found!
                    </Typography>
                    <Box
                        component="img"
                        src={nullLogo}
                        sx={{
                            mx: 'auto',
                            height: 250,
                            my: { xs: 5, sm: 10 },
                        }}
                    />
                    <Box display='flex' gap={2}>
                        <Button onClick={goBack} size="large" variant="contained" color="inherit">Go back</Button>
                        <Button onClick={() => window.location.href = '/'} size="large" variant="contained">Go Dashboard</Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
