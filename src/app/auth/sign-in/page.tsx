'use client';
/* eslint-disable */

import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Text,
  useToast,
  Link as ChakraLink,
  keyframes,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { MdOutlineRemoveRedEye, MdLock, MdEmail, MdDashboard } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

const pulseRing = keyframes`
  0% { transform: scale(0.33); opacity: 0.8; }
  80%, 100% { opacity: 0; }
`;

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const toast = useToast();
  
  const handleClick = () => setShow(!show);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiUrl}/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Sign in failed');
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast({
        title: 'Access Granted',
        description: 'Welcome to AssetCare Command Center.',
        status: 'success',
        duration: 2,
        isClosable: true,
        position: 'top-right',
        render: () => (
            <Box color="white" p={3} bg="blue.600" borderRadius="md" boxShadow="lg">
                <Flex align="center" gap="3">
                    <Icon as={MdDashboard} w={5} h={5} />
                    <Box>
                        <Text fontWeight="bold">Access Granted</Text>
                        <Text fontSize="sm">Welcome to AssetCare Command Center.</Text>
                    </Box>
                </Flex>
            </Box>
        )
      });
      router.push('/admin/default');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: 'Access Denied',
        description: 'Invalid credentials.',
        status: 'error',
        duration: 3,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex 
      h="100vh" 
      w="100vw" 
      align="center" 
      justify="center" 
      bg="#050A18" // Deep Technical Navy (almost black but blue-rich)
      position="relative"
      overflow="hidden"
    >
      {/* 1. Technical Grid Background */}
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        opacity="0.1"
            style={{
                backgroundImage: 'linear-gradient(#4A5568 1px, transparent 1px), linear-gradient(90deg, #4A5568 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }}
      />
      
      {/* 2. Spotlight Glow Effect */}
      <Box
        position="absolute"
        top="-20%"
        left="20%"
        w="600px"
        h="600px"
        bg="blue.600"
        filter="blur(180px)"
        opacity="0.25"
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-10%"
        w="500px"
        h="500px"
        bg="cyan.500"
        filter="blur(150px)"
        opacity="0.15"
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} // Bezier for technical feel
        style={{ width: '100%', maxWidth: '1000px', margin: '20px', zIndex: 10 }}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          bg="rgba(11, 20, 55, 0.7)" // Deep Dark Glass
          backdropFilter="blur(20px)"
          border="1px solid rgba(255, 255, 255, 0.08)"
          borderRadius="24px" // Slightly tighter radius for tech feel
          overflow="hidden"
          boxShadow="0px 40px 80px rgba(0,0,0,0.6)"
          minH="550px"
        >
          {/* Left: Brand Identity (Dark Mode) */}
          <Flex 
            flex="1" 
            p={{ base: "40px", md: "60px" }}
            direction="column"
            justify="center"
            bg="transparent"
            position="relative"
            borderRight="1px solid rgba(255,255,255,0.05)"
          >
             {/* Radar/Pulse Animation behind Logo */}
             <Box position="absolute" top="60px" left="60px" zIndex="0">
                <Box
                    as={motion.div}
                    position="absolute"
                    borderRadius="50%"
                    w="50px" h="50px"
                    bg="blue.500"
                    animation={`${pulseRing} 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite`}
                />
             </Box>

             <Flex align="center" mb="40px" zIndex="1">
                <Flex 
                    w="50px" h="50px" borderRadius="12px" 
                    bgGradient="linear(135deg, blue.600, cyan.600)" 
                    align="center" justify="center" 
                    boxShadow="0px 0px 20px rgba(49, 130, 206, 0.5)" // Glowing Icon
                    mr="20px"
                    border="1px solid rgba(255,255,255,0.2)"
                >
                    <Icon as={MdDashboard} color="white" w="24px" h="24px" />
                </Flex>
                <Text fontSize="2xl" fontWeight="800" color="white" letterSpacing="2px" textTransform="uppercase">
                    AssetCare
                </Text>
             </Flex>
             
             <Heading color="white" fontSize={{ base: "3xl", md: "5xl" }} fontWeight="700" letterSpacing="-1px" lineHeight="1.1" mb="24px" zIndex="1">
                Precision <br/>
                <Text as="span" color="cyan.400">Monitoring.</Text>
             </Heading>
             
             <Text color="gray.400" fontSize="md" lineHeight="1.6" maxW="380px" zIndex="1">
                Real-time sensor analytics and predictive maintenance for mission-critical industrial systems.
             </Text>
             
             {/* Tech Stats / Decor */}
             <Flex mt="auto" gap="20px" zIndex="1">
                <Box>
                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">System Status</Text>
                    <Flex align="center" gap="6px" mt="4px">
                        <Box w="6px" h="6px" borderRadius="50%" bg="green.400" boxShadow="0 0 8px #48BB78" />
                        <Text fontSize="sm" color="green.400" fontWeight="bold">ONLINE</Text>
                    </Flex>
                </Box>
                <Box>
                     <Text fontSize="xs" color="gray.500" textTransform="uppercase" fontWeight="bold">Latency</Text>
                     <Text fontSize="sm" color="cyan.400" fontWeight="bold" mt="4px">24ms</Text>
                </Box>
             </Flex>
          </Flex>

          {/* Right: Login Form */}
          <Flex 
            flex="1" 
            p={{ base: "40px", md: "60px" }}
            bg="white"
            direction="column"
            justify="center"
            borderTopLeftRadius={{ base: "30px", md: "0px" }}
            borderBottomLeftRadius={{ base: "0px", md: "0px" }}
          >
              <Box>
                <Heading fontSize="2xl" fontWeight="bold" color="navy.800" mb="8px">
                    Sign In
                </Heading>
                <Text color="gray.500" mb="40px">
                    Enter your credentials to access the workspace.
                </Text>
                
                <form onSubmit={handleSignIn}>
                    {error && (
                        <Box mb="24px" p="15px" bg="red.50" color="red.500" borderRadius="12px" fontSize="sm" fontWeight="500">
                            {error}
                        </Box>
                    )}
                    
                    <FormControl mb="24px">
                        <FormLabel color="navy.700" fontWeight="600" fontSize="sm">Email</FormLabel>
                        <InputGroup>
                            <Input 
                                h="50px"
                                borderRadius="16px"
                                bg="gray.50"
                                border="1px solid"
                                borderColor="gray.100"
                                _focus={{ bg: "white", borderColor: "brand.500", boxShadow: "0px 0px 0px 1px #4299e1" }}
                                placeholder="name@assetcare.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                pl="45px"
                                fontSize="sm"
                            />
                            <InputLeftElement h="50px" w="45px">
                                <Icon as={MdEmail} color="gray.400" w="20px" h="20px" />
                            </InputLeftElement>
                        </InputGroup>
                    </FormControl>

                    <FormControl mb="30px">
                        <FormLabel color="navy.700" fontWeight="600" fontSize="sm">Password</FormLabel>
                        <InputGroup>
                            <InputLeftElement h="50px" w="45px">
                                <Icon as={MdLock} color="gray.400" w="20px" h="20px" />
                            </InputLeftElement>
                             <Input 
                                h="50px"
                                borderRadius="16px"
                                bg="gray.50"
                                border="1px solid"
                                borderColor="gray.100"
                                _focus={{ bg: "white", borderColor: "brand.500", boxShadow: "0px 0px 0px 1px #4299e1" }}
                                placeholder="Enter your password"
                                type={show ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                pl="45px"
                                fontSize="sm"
                            />
                            <InputRightElement h="50px" mr="5px">
                                  <Icon
                                    color="gray.400"
                                    cursor="pointer"
                                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                                    onClick={handleClick}
                                  />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <Button
                        w="100%"
                        h="54px"
                        variant="brand"
                        bg="brand.500"
                        color="white"
                        fontSize="sm"
                        fontWeight="600"
                        borderRadius="16px"
                        _hover={{ bg: "brand.600", transform: "translateY(-2px)", boxShadow: "0px 10px 20px rgba(66, 153, 225, 0.4)" }}
                        _active={{ bg: "brand.700", transform: "translateY(0px)" }}
                        transition="all 0.2s"
                        type="submit"
                        isLoading={isLoading}
                    >
                        Sign In
                    </Button>
                </form>
              </Box>
          </Flex>
        </Flex>
      </motion.div>
    </Flex>
  );
}
