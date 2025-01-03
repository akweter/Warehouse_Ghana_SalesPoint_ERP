import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons';
import {
    Avatar,
    Box,
    Chip,
    ClickAwayListener,
    Divider,
    FormControlLabel,
    Grid,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    styled,
    Popper,
    Stack,
    Switch,
    Typography
} from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import MainCard from '../../../../ui-component/cards/MainCard';
import Transitions from '../../../../ui-component/extended/Transitions';
import { GreetUser } from '../../../../utilities/globalTime';
import LogOut from '../../../../auth/logout';
import { TOGGLE_THEME } from '../../../../store/actions';


// ==============================|| PROFILE MENU ||============================== //

const ThemeSwitch = styled(Switch)(({ theme }) => ({
    width: 50,
    height: 30,
    padding: 5,
    '& .MuiSwitch-switchBase': {
        margin: 2,
        padding: 0,
        transform: 'translateX(4px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(16px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#69f6f6',
                )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: '#aab4be',
                ...theme.applyStyles('dark', {
                    backgroundColor: '#8796A5',
                }),
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: '#001e3c',
        width: 24,
        height: 24,
        '&::before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                '#fc6755',
            )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
        },
        ...theme.applyStyles('dark', {
            backgroundColor: '#003892',
        }),
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        borderRadius: 15,
        ...theme.applyStyles('dark', {
            backgroundColor: '#8796A5',
        }),
    },
}));

const ProfileSection = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    const [selectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);

    const anchorRef = useRef(null);
    const prevOpen = useRef(open);

    const themes = useSelector((state) => state.customization.theme);
    const dispatch = useDispatch();

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            dispatch({
                type: TOGGLE_THEME,
                theme: e.matches ? 'dark' : 'light',
            });
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [dispatch]);

    // Define the handleThemeToggle function
    const handleThemeToggle = () => {
        dispatch({
            type: TOGGLE_THEME,
            theme: themes === 'dark' ? 'light' : 'dark',
        });
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleToggle = () => setOpen((prevOpen) => !prevOpen);

    const getUserName = () => {
        const systemUser = window.localStorage.getItem('userInfo');
        if (systemUser) {
            const parseSystemUser = JSON.parse(systemUser);
            const systemUserName = parseSystemUser.userName;
            if (systemUserName) {
                return systemUserName;
            } else {
                return 'User';
            }
        }
    }

    
    useEffect(() => {
        getUserName();

        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const stringAvatar = (name) => {
        return name ? name.split(' ').map(part => part.slice(0, 2).toUpperCase()).join('') : 'WG';
    };

    return (
        <>
            <Chip
                sx={{
                    // height: 40,
                    width: 20,
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        sx={{ cursor: 'pointer' }}
                        ref={anchorRef}
                        color="inherit"
                        onClick={handleToggle}
                    >
                        {stringAvatar(getUserName())}
                    </Avatar>
                }
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ p: 2 }}>
                                        <Stack>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Typography variant="h4">{GreetUser()}</Typography>
                                                <Typography variant='h4' color='red'>{getUserName()}</Typography>
                                            </Stack>
                                        </Stack>
                                        <Divider />
                                    </Box>
                                    <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                                        <Box sx={{ pt: 2 }}>
                                            <List
                                                component="nav"
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 350,
                                                    minWidth: 300,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRadius: '10px',
                                                    [theme.breakpoints.down('md')]: {
                                                        minWidth: '100%'
                                                    },
                                                    '& .MuiListItemButton-root': {
                                                        mt: 0.5
                                                    }
                                                }}
                                            >
                                                <ListItemButton
                                                    onClick={() => { window.alert('Account setting 1') }}
                                                >
                                                    <ListItemIcon>
                                                        <IconSettings stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Account Settings</Typography>} />
                                                </ListItemButton>
                                                <ListItemButton onClick={() => { window.alert('Account setting 2') }}>
                                                    <ListItemIcon>
                                                        <IconUser stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={
                                                        <Grid container spacing={1} justifyContent="space-between">
                                                            <Grid item>
                                                                <Typography variant="body2">Social Profile</Typography>
                                                            </Grid>
                                                            <Grid item>
                                                                <Chip
                                                                    label="02"
                                                                    size="small"
                                                                    sx={{
                                                                        bgcolor: theme.palette.warning.dark,
                                                                        color: theme.palette.background.default
                                                                    }}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    }/>
                                                </ListItemButton>
                                                <ListItemButton
                                                    sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                    selected={selectedIndex === 4}
                                                    onClick={LogOut}
                                                >
                                                    <ListItemIcon>
                                                        <IconLogout stroke={1.5} size="1.3rem" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                                                </ListItemButton>
                                                <ListItemButton onClick={handleThemeToggle}>
                                                    <ListItemIcon>
                                                        <></>
                                                    </ListItemIcon>
                                                    <ListItemText primary={
                                                        <FormControlLabel
                                                            control={<ThemeSwitch checked={themes === 'dark'} />}
                                                        />
                                                    } />
                                                </ListItemButton>
                                            </List>
                                        </Box>
                                    </PerfectScrollbar>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
