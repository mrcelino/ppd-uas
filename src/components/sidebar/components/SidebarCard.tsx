'use client';
import {
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';
import { useRouter } from 'next/navigation';

export default function SidebarDocs() {
  const bgColor = 'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)';
  const router = useRouter();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${apiUrl}/auth/signout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Clear local storage regardless of response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
        status: 'success',
        duration: 2,
        isClosable: true,
      });

      // Redirect to sign in
      router.push('/auth/sign-in');
    } catch (error) {
      // Clear storage even on error
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      router.push('/auth/sign-in');
    }
  };

  return (
    <Flex
      justify="center"
      direction="column"
      align="center"
      bg={useColorModeValue(
        'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)', 
        'navy.800'
      )}
      borderRadius="30px"
      me="20px"
      position="relative"
      p="24px"
      boxShadow="0px 20px 40px rgba(0, 0, 0, 0.2)"
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        mb="12px"
      >
        <Flex 
          w="50px" 
          h="50px" 
          bg="whiteAlpha.300" 
          borderRadius="50%" 
          justify="center" 
          align="center"
          mb="10px"
          backdropFilter="blur(10px)"
        >
          <Icon as={MdLogout} w="24px" h="24px" color="white" />
        </Flex>
        <Text
          fontSize="md"
          fontWeight="700"
          color="white"
          textAlign="center"
        >
          Ready to Leave?
        </Text>
        <Text
          fontSize="sm"
          color="whiteAlpha.800"
          textAlign="center"
        >
          See you soon!
        </Text>
      </Flex>
      <Button
        bg="white"
        color="brand.500"
        _hover={{ bg: 'whiteAlpha.900' }}
        _active={{ bg: 'white' }}
        fontWeight="bold"
        fontSize="sm"
        minW="185px"
        borderRadius="16px"
        onClick={handleLogout}
        boxShadow="0px 10px 20px rgba(0, 0, 0, 0.1)"
      >
        Log Out
      </Button>
    </Flex>
  );
}
