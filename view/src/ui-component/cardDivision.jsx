import { createTheme, styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
}));
const lightTheme = createTheme({ palette: { mode: 'light' } });

const Screens = { Item, lightTheme, }

export default Screens;