import { Icon } from '@chakra-ui/react';
import { MdHome, MdBuild } from 'react-icons/md';

// Admin Imports
// import MainDashboard from './pages/admin/default';

// Auth Imports
// import SignInCentered from './pages/auth/sign-in';
import { IRoute } from 'types/navigation';

const routes: IRoute[] = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  },
  {
    name: 'Machines',
    layout: '/admin',
    path: '/machines',
    icon: <Icon as={MdBuild} width="20px" height="20px" color="inherit" />,
  },
];

export default routes;
