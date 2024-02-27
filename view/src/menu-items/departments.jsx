import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const departments = {
  id: 'departments',
  type: 'group',
  children: [
    {
      id: 'departments',
      title: 'DEPARTMENTS',
      type: 'collapse',
      icon: ManageAccountsIcon,
      children: [
        {
          id: 'hr',
          title: 'Human Resource',
          type: 'item',
          url: '/hr',
          target: false
        },
        {
          id: 'account',
          title: 'Accounts',
          type: 'item',
          url: '/account',
          target: false
        },
        {
          id: 'procurement',
          title: 'Procurement',
          type: 'item',
          url: '/procurement',
          target: false
        },
        {
          id: 'salesmart',
          title: 'Sales & Marketing',
          type: 'item',
          url: '/salesmart',
          target: false
        },
        {
          id: 'legal',
          title: 'Legal',
          type: 'item',
          url: '/legal',
          target: false
        },
        {
          id: 'logistic',
          title: 'logistic',
          type: 'item',
          url: '/logistic',
          target: false
        },
        {
          id: 'IT',
          title: 'System Admin & IT',
          type: 'item',
          url: '/IT',
          target: false
        }
      ]
    }
  ]
};

export default departments;
