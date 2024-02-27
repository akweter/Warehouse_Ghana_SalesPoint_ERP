import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';

const dashboard = {
  id: 'dashboard',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'DASHBOARD',
      type: 'item',
      url: '/',
      icon: GridViewRoundedIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
