import PropTypes from 'prop-types';
import { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import DashBoardInvoice from 'views/invoices/dashboard/InvoicesCard';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};



const HomeRecentOrders = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box padding={3}>
      <Typography variant='h3' color='#082295'>Recent History</Typography>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Transactions" />
        <Tab label="Quotations" />
        <Tab label="Leads" />
        <Tab label="Insight" />
        <Tab label="Pricing Chart" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <DashBoardInvoice />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant='h1'>Quotations</Typography>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography variant='h1'>Follow Ups/Leads</Typography>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography variant='h1'>Business Insight</Typography>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Typography variant='h1'>Pricing Dashboard</Typography>
      </TabPanel>
    </Box>
  );
}
HomeRecentOrders.propTypes = {
  isLoading: PropTypes.bool
};

export default HomeRecentOrders;
