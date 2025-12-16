import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';
import { useRouter } from 'next/navigation';

interface MachineHeaderProps {
  isConnected: boolean;
}

export const MachineHeader = ({ isConnected }: MachineHeaderProps) => {
  const router = useRouter();
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  return (
    <Flex mb="20px" align="center" justify="space-between">
      <Button
        leftIcon={<Icon as={MdArrowBack} />}
        variant="ghost"
        onClick={() => router.push('/admin/machines')}
      >
        Back to Machines
      </Button>

      {/* WebSocket Connection Status */}
      <Flex align="center" gap="8px">
        <Box
          w="10px"
          h="10px"
          borderRadius="50%"
          bg={isConnected ? 'green.500' : 'red.500'}
          animation={isConnected ? 'pulse 2s infinite' : 'none'}
        />
        <Text fontSize="sm" color={textColorSecondary}>
          {isConnected ? 'Live Updates' : 'Disconnected'}
        </Text>
      </Flex>
    </Flex>
  );
};
