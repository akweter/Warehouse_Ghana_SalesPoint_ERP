import { createTheme, styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
}));

// const lightTheme = createTheme({ palette: { mode: 'light' } });
const lightTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#fafafa',
            paper: '#f0f0f0',
        },
        primary: {
            main: '#cfcfcf',
        },
        text: {
            primary: '#424242',
            secondary: '#757575',
        },
    },
});

const Screens = { Item, lightTheme, }

export default Screens;