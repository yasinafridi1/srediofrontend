import { SideBar } from '@CustomTypes/index';

export const sidebar: SideBar[] = [
  {
    text: 'Dashboard',
    icon: 'dashboard', // Material icon
    link: '/dashboard',
  },
  {
    text: 'AirTable',
    icon: 'folder', // You can also use 'storage' or 'source'
    link: '/airtable',
  },
  {
    text: 'Profile',
    icon: 'person',
    link: '/profile',
  },
];
