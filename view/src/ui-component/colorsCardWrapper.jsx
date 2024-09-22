import { styled } from '@mui/material/styles';
import MainCard from './cards/MainCard';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
} from '@mui/material';
import { useTheme } from 'styled-components';

export const GreenCardWrapperEffect = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.success.light,
  color: theme.palette.secondary.light,
  overflow: 'hidden',
  position: 'relative',
  // margin: 5,
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export const YellowCardWrapperEffect = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.warning.light,
  color: theme.palette.secondary.light,
  overflow: 'hidden',
  position: 'relative',
  // margin: 5,
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export const RedCardWrapperEffect = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.tonalOffset.light,
  color: theme.palette.secondary.dark,
  overflow: 'hidden',
  position: 'relative',
  // margin: 5,
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export const BlueCardWrapperEffect = styled(MainCard)(({ theme }) => ({
  backgroundColor: '#FBF0FB',
  overflow: 'hidden',
  position: 'relative',
  // margin: 5,
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export const OrangeCardWrapperEffect = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
  color: theme.palette.primary.dark,
  overflow: 'hidden',
  position: 'relative',
  // margin: 5,
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export const GrayCardWrapperEffect = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.grey.light,
  color: theme.palette.error.dark,
  overflow: 'hidden',
  position: 'relative',
  // margin: 5,
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export const BlackCardWrapperEffect = styled(MainCard)(({ theme }) => ({
  backgroundColor: '#C2F9FB',
  color: theme.palette.error.dark,
  overflow: 'hidden',
  position: 'relative',
  // margin: 5,
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

export const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: `rgba(${theme}, 0.01)`,
  color: '#7008AF',
  overflow: 'hidden',
  position: 'relative',
  height: 180,
}));

export const InventoryCard = styled(MainCard)(({ bg }) => ({
  overflow: 'hidden',
  position: 'relative',
  height: 120,
  background: bg,
}));

export const CustomLLogo = ({ border, avatarIcon }) => {
  const theme = useTheme();
  return (
    <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
      <ListItemAvatar>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.largeAvatar,
            border: border,
            backgroundColor: 'white',
            padding: 3.5,
          }}
        >
          <img src={avatarIcon} width={50} alt=''/>
        </Avatar>
      </ListItemAvatar>
    </ListItem>
  );
};
