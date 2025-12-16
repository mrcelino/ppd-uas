import React from 'react';

// chakra imports
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import Content from 'components/sidebar/components/Content';
import {
  renderThumb,
  renderTrack,
  renderView,
} from 'components/scrollbar/Scrollbar';
import dynamic from 'next/dynamic';

const Scrollbars = dynamic(
  () => import('react-custom-scrollbars-2').then((mod) => mod.Scrollbars),
  { ssr: true },
);

// Assets
import { IoMenuOutline } from 'react-icons/io5';
import { IRoute } from 'types/navigation';
import { isWindowAvailable } from 'utils/navigation';

interface SidebarResponsiveProps {
  routes: IRoute[];
}

interface SidebarProps extends SidebarResponsiveProps {
  [x: string]: any;
}

function Sidebar(props: SidebarProps) {
  const { routes } = props;

  let variantChange = '0.2s linear';
  let shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset',
  );
  // Chakra Color Mode
  let sidebarBg = useColorModeValue(
    'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(244, 247, 254, 0.8) 100%)',
    'linear-gradient(180deg, rgba(27, 37, 75, 0.9) 0%, rgba(17, 28, 68, 0.9) 100%)',
  );
  let sidebarMargins = '20px';

  // SIDEBAR
  return (
    <Box display={{ sm: 'none', xl: 'block' }} position="fixed" minH="100%">
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="300px"
        h="calc(100vh - 40px)"
        m={sidebarMargins}
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
        borderRadius="30px"
        backdropFilter="blur(20px)"
        border="1px solid"
        borderColor={useColorModeValue('whiteAlpha.300', 'whiteAlpha.100')}
      >
        <Scrollbars universal={true}>
          <Content routes={routes} />
        </Scrollbars>
      </Box>
    </Box>
  );
}

// FUNCTIONS

export function SidebarResponsive(props: SidebarResponsiveProps) {
  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  let menuColor = useColorModeValue('gray.400', 'white');
  // // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const { routes } = props;
  // let isWindows = navigator.platform.startsWith("Win");
  //  BRAND

  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} alignItems="center">
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my="auto"
          w="20px"
          h="20px"
          me="10px"
          _hover={{ cursor: 'pointer' }}
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={
          isWindowAvailable() && window.document.documentElement.dir === 'rtl'
            ? 'right'
            : 'left'
        }
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent w="285px" maxW="285px" bg={sidebarBackgroundColor}>
          <DrawerCloseButton
            zIndex="3"
            onClick={onClose}
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
          />
          <DrawerBody maxW="285px" px="0rem" pb="0">
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
              universal={true}
            >
              <Content routes={routes} />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
// PROPS

export default Sidebar;
