'use client';
// Chakra Imports
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom Components
import { ItemContent } from 'components/menu/ItemContent';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
// Assets
import navImage from '/public/img/layout/Navbar.png';
import { FaEthereum } from 'react-icons/fa';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { MdInfoOutline, MdNotificationsNone } from 'react-icons/md';
import routes from 'routes';
export default function HeaderLinks(props: {
  secondary: boolean;
  onOpen: boolean | any;
  fixed: boolean | any;
}) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.700', 'brand.400');
  const ethColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const ethBox = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );
  const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');

  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg="transparent"
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
    >
      <SidebarResponsive routes={routes} />
    </Flex>
  );
}
