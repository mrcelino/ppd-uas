// Chakra imports
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex alignItems="center" flexDirection="column">
      <Text 
        fontSize="2xl" 
        fontWeight="bold" 
        bgGradient="linear(to-r, brand.500, brand.400)" 
        bgClip="text"
        mb="32px"
        letterSpacing="1px"
      >
        AssetCare
      </Text>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
