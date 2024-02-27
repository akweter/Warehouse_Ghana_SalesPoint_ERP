import { IconWorldWww, IconReportMoney, IconBrandGoogleAnalytics } from '@tabler/icons';

const integrations = {
  id: 'integration',
  type: 'group',
  children: [
    {
      id: 'woocommerce',
      title: 'Woocommerce',
      type: 'item',
      url: '/woocommerce',
      icon: IconBrandGoogleAnalytics,
      breadcrumbs: false
    },
    {
      id: 'reports',
      title: 'Analysis',
      type: 'item',
      url: '/reports',
      icon: IconReportMoney,
      breadcrumbs: false
    },
    {
      id: 'warehouseghana',
      title: 'Ecommerce',
      type: 'item',
      url: 'https://warehouseghana.com/',
      icon: IconWorldWww,
      external: true,
      target: true
    }
  ]
};

export default integrations;
