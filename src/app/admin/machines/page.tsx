'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
  SimpleGrid,
  Badge,
} from '@chakra-ui/react';
import { MdSearch, MdBuild, MdLocationOn, MdCalendarToday, MdCheckCircle } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import Card from 'components/card/Card';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';

interface Machine {
  id: string;
  productId: string;
  type: string;
  name: string;
  description: string;
  location: string;
  installationDate: string;
  lastMaintenanceDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function Machines() {
  const router = useRouter();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const toast = useToast();
  
  // All hooks at top level
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.700');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const brandColor = useColorModeValue('brand.500', 'white');
  const shadowColor = useColorModeValue('0px 18px 40px rgba(112, 144, 176, 0.12)', 'unset');
  const typeBadgeBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const typeBadgeColor = useColorModeValue('gray.700', 'gray.200');
  const summaryBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const hoverBg = useColorModeValue('brand.50', 'whiteAlpha.100');
  const statsBg = useColorModeValue('white', 'navy.700');
  
  const statusBg = {
    operational: useColorModeValue('green.100', 'rgba(34, 197, 94, 0.2)'),
    maintenance: useColorModeValue('yellow.100', 'rgba(234, 179, 8, 0.2)'),
    inactive: useColorModeValue('red.100', 'rgba(239, 68, 68, 0.2)'),
  };
  const statusColor = {
    operational: 'green.600',
    maintenance: 'yellow.600',
    inactive: 'red.600',
  };

  useEffect(() => {
    fetchMachines();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterMachines();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machines, searchTerm, selectedStatus, selectedType]);

  const fetchMachines = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = localStorage.getItem('accessToken');

      const response = await fetch(`${apiUrl}/machines`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch machines');
      }

      const data = await response.json();
      setMachines(data.data || []);
      setFilteredMachines(data.data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to fetch machines',
        status: 'error',
        duration: 3,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMachines = () => {
    let filtered = machines;

    if (searchTerm) {
      filtered = filtered.filter(
        (machine) =>
          machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          machine.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          machine.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((machine) => machine.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter((machine) => machine.type === selectedType);
    }

    setFilteredMachines(filtered);
  };

  const getUniqueTypes = () => {
    return [...new Set(machines.map((m) => m.type))];
  };

  const getUniqueStatuses = () => {
    return [...new Set(machines.map((m) => m.status))];
  };

  const getStatusCount = (status: string) => {
    return machines.filter((m) => m.status === status).length;
  };

  const operationalCount = machines.filter((m) => m.status === 'operational').length;
  const maintenanceCount = machines.filter((m) => m.status === 'maintenance').length;
  const inactiveCount = machines.filter((m) => m.status === 'inactive').length;

  return (
    <Flex direction="column" pt={{ base: '130px', md: '20px', xl: '20px' }}>
      {/* Header */}
      <Flex mb="20px" justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              Machine Management
          </Text>
          <Button
            variant='brand'
            fontWeight='500'
            onClick={fetchMachines}
            isLoading={loading}
            leftIcon={<Icon as={MdBuild} />}
          >
            Refresh
          </Button>
      </Flex>

        {/* Statistics Cards */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          gap="20px"
          mb="40px"
        >
          <Box>
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
                  icon={<Icon w="28px" h="28px" as={MdBuild} color="white" />}
                />
              }
              name="Total Machines"
              value={machines.length.toString()}
            />
          </Box>
          <Box>
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg="linear-gradient(135deg, #22C55E 0%, #16A34A 100%)"
                  icon={<Icon w="28px" h="28px" as={MdCheckCircle} color="white" />}
                />
              }
              name="Operational"
              value={operationalCount.toString()}
            />
          </Box>
          <Box>
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg="linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)"
                  icon={<Icon w="28px" h="28px" as={MdBuild} color="white" />}
                />
              }
              name="In Maintenance"
              value={maintenanceCount.toString()}
            />
          </Box>
          <Box>
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg="linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
                  icon={<Icon w="28px" h="28px" as={MdBuild} color="white" />}
                />
              }
              name="Inactive"
              value={inactiveCount.toString()}
            />
          </Box>
        </SimpleGrid>

        {/* Machines Grid */}
        {loading ? (
          <Flex justify="center" align="center" minH="400px">
            <Spinner size="xl" thickness="4px" color="brand.500" emptyColor="gray.200" />
          </Flex>
        ) : filteredMachines.length === 0 ? (
          <Card bg={cardBg} p="60px" textAlign="center" borderRadius="20px">
            <Icon as={MdBuild} w="80px" h="80px" color="gray.300" mx="auto" mb="20px" />
            <Text color={textColorSecondary} fontSize="lg" fontWeight="500">
              No machines found
            </Text>
            <Text color={textColorSecondary} fontSize="sm" mt="8px">
              Try adjusting your search or filter criteria
            </Text>
          </Card>
        ) : (
          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            }}
            gap="20px"
          >
            {filteredMachines.map((machine) => (
              <Card
                key={machine.id}
                p="20px"
                bg={cardBg}
                borderRadius="20px"
                _hover={{
                  transform: 'translateY(-5px)',
                  boxShadow: '0px 20px 40px rgba(112, 144, 176, 0.12)',
                }}
                transition="all 0.3s ease-in-out"
                cursor="pointer"
                onClick={() => router.push(`/admin/machines/${machine.id}`)}
              >
                  <Flex justify="space-between" align="start" mb="20px">
                      <IconBox
                        w="50px"
                        h="50px"
                        bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
                        icon={<Icon as={MdBuild} w="24px" h="24px" color="white" />}
                      />
                      <Badge
                        bg={
                          statusBg[machine.status as keyof typeof statusBg] ||
                          statusBg.operational
                        }
                        color={
                          statusColor[machine.status as keyof typeof statusColor] ||
                          statusColor.operational
                        }
                        px="10px"
                        py="4px"
                        borderRadius="12px"
                        fontSize="10px"
                        fontWeight="700"
                        textTransform="uppercase"
                      >
                        {machine.status}
                      </Badge>
                  </Flex>

                  <Box mb="20px">
                      <Text
                        color={textColor}
                        fontSize="lg"
                        fontWeight="700"
                        mb="5px"
                        noOfLines={1}
                      >
                        {machine.name}
                      </Text>
                      <Text
                        color={textColorSecondary}
                        fontSize="sm"
                        fontWeight="500"
                        noOfLines={1}
                      >
                        {machine.productId}
                      </Text>
                  </Box>

                  <Box mb="20px">
                       <Flex align="center" gap="8px" mb="8px">
                           <Icon as={MdLocationOn} color="gray.400" w="16px" h="16px" />
                           <Text color={textColorSecondary} fontSize="sm">
                               {machine.location}
                           </Text>
                       </Flex>
                       <Flex align="center" gap="8px">
                           <Icon as={MdCalendarToday} color="gray.400" w="16px" h="16px" />
                           <Text color={textColorSecondary} fontSize="sm">
                               Last: {new Date(machine.lastMaintenanceDate).toLocaleDateString()}
                           </Text>
                       </Flex>
                  </Box>

                  <Button
                    w="100%"
                    variant="light"
                    color="brand.500"
                    fontSize="sm"
                    fontWeight="600"
                    h="36px"
                  >
                    View Details
                  </Button>
              </Card>
            ))}
          </Grid>
        )}

        {/* Summary */}
        {!loading && filteredMachines.length > 0 && (
          <Card bg={summaryBg} p="20px" mt="20" borderRadius="16px" boxShadow="none" border="1px dashed" borderColor={borderColor}>
            <Flex justify="space-between" align="center" flexWrap="wrap" gap="10px">
              <Text color={textColorSecondary} fontSize="14px" fontWeight="500">
                Showing <Text as="span" color={brandColor} fontWeight="700">{filteredMachines.length}</Text> of{' '}
                <Text as="span" color={textColor} fontWeight="700">{machines.length}</Text> machines
              </Text>
              {(searchTerm || selectedStatus !== 'all' || selectedType !== 'all') && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('all');
                    setSelectedType('all');
                  }}
                  colorScheme="red"
                >
                  Clear Filters
                </Button>
              )}
            </Flex>
          </Card>
        )}
    </Flex>
  );
}
