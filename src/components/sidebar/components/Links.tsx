/* eslint-disable */

// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import { IRoute } from 'types/navigation';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface SidebarLinksProps {
  routes: IRoute[];
}

export function SidebarLinks(props: SidebarLinksProps) {
  const { routes } = props;

  //   Chakra color mode
  const pathname = usePathname();

  let activeColor = useColorModeValue('gray.700', 'white');
  let inactiveColor = useColorModeValue(
    'secondaryGray.600',
    'secondaryGray.600',
  );
  let activeIcon = useColorModeValue('brand.500', 'white');
  let textColor = useColorModeValue('secondaryGray.500', 'white');
  let brandColor = useColorModeValue('brand.500', 'brand.400');

  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, index: number) => {
      if (
        route.layout === '/admin' ||
        route.layout === '/auth' ||
        route.layout === '/rtl'
      ) {
        const isActive = activeRoute(route.path.toLowerCase());
        return (
          <Link key={index} href={route.layout + route.path}>
            <Box>
              <HStack
                spacing={isActive ? '22px' : '26px'}
                py="12px" /* Increased padding */
                ps="20px" /* Increased padding */
                pe="20px" /* Added right padding */
                m="10px 15px" /* Added margin for floating look */
                borderRadius="30px" /* Pill shape */
                bg={isActive ? useColorModeValue('brand.50', 'whiteAlpha.100') : 'transparent'}
                transition="all 0.2s ease-in-out"
                _hover={{
                  bg: isActive ? useColorModeValue('brand.100', 'whiteAlpha.200') : useColorModeValue('gray.50', 'whiteAlpha.50'),
                }}
              >
                <Flex w="100%" alignItems="center" justifyContent="center">
                  <Box
                    color={isActive ? activeIcon : textColor}
                    me="18px"
                    transition="color 0.2s"
                  >
                    {route.icon}
                  </Box>
                  <Text
                    me="auto"
                    color={isActive ? activeColor : textColor}
                    fontWeight={isActive ? 'bold' : 'normal'}
                    fontSize="md"
                  >
                    {route.name}
                  </Text>
                </Flex>
              </HStack>
            </Box>
          </Link>
        );
      }
    });
  };
  //  BRAND
  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
