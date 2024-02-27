import { styled } from '@mui/material/styles';
import {
    Paper,
    InputBase,
    Box,
} from '@mui/material';

export const MasonryContainer = styled(Box)({
    columnCount: 2,
    columnGap: '10px',
    width: '100%'
});

export const MasonryItem = styled(Paper)({
    breakInside: 'avoid-column',
    marginBottom: '10px',
    padding: '10px',
    textAlign: 'center',
});

export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    backgroundColor: '#E9E9E9',
    '&:hover': { backgroundColor: '#FFEBE7' },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('lg')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
    display: 'flex',
    flexDirection: 'row',
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '25ch',
        },
    },
}));

export const ResultItem = styled('div')(({ theme }) => ({
    padding: theme.spacing(1),
    borderBottom: '1px solid #ddd',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#f1f1f1',
    },
}));

export const ResultsContainer = styled('div')({
    position: 'relative',
    top: '100%',
    width: '50%',
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'white',
    border: '1px solid #ddd',
});
