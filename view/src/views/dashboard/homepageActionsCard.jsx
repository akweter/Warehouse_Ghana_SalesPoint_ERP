import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import HomeDarkCard from './darkCard';

const DarkWhiteCard = ({ darkCardProps }) => {
  return (
    <Box sx={{ display: 'flex', gap: 0 }}>
      <Box>
        <HomeDarkCard {...darkCardProps} />
      </Box>
    </Box>
  );
};

DarkWhiteCard.propTypes = {
  darkCardProps: PropTypes.object,
};

export default DarkWhiteCard;
