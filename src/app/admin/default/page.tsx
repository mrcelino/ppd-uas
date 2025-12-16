'use client';
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import {
  Box,
  Flex,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Text,
  Spinner,
} from '@chakra-ui/react';
// Custom components
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import BarChart from 'components/charts/BarChart';
import { SensorData } from 'types/sensorData';
import CheckTable from 'views/admin/default/components/CheckTable';
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from 'react-icons/md';
import { useState, useEffect } from 'react';

export default function Default() {
  // Chakra Color Mode
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchData = async () => {
         try {
             // Fetch latest 30 records as requested
             const token = localStorage.getItem('accessToken');
             const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sensors?limit=30`, {
                 headers: {
                     'Authorization': `Bearer ${token}`,
                     'Content-Type': 'application/json'
                 }
             });
             const result = await response.json();
             if(result.data) {
                 setSensorData(result.data);
             }
         } catch (e) {
             console.error("Failed to fetch dashboard data", e);
         } finally {
             setLoading(false);
         }
     }
     fetchData();
  }, []);

  // Process Data
  const uniqueMachines = Array.from(new Set(sensorData.map((d) => d.machineId)));
  const machineCount = uniqueMachines.length;
  
  // Calculate Averages
  const avgAirTemp = sensorData.length > 0 
      ? (sensorData.reduce((acc, curr) => acc + (curr.airTemp || 0), 0) / sensorData.length).toFixed(1) 
      : 0;
  
  const avgProcessTemp = sensorData.length > 0
      ? (sensorData.reduce((acc, curr) => acc + (curr.processTemp || 0), 0) / sensorData.length).toFixed(1)
      : 0;

  const avgRotationalSpeed = sensorData.length > 0
      ? (sensorData.reduce((acc, curr) => acc + (curr.rotationalSpeed || 0), 0) / sensorData.length).toFixed(0)
      : 0;

  // Prepare Chart Data (Latest Temp per Machine)
  const latestMachineData = uniqueMachines.map(id => {
      return sensorData.find((d) => d.machineId === id);
  }).filter(Boolean) as SensorData[];

  const chartDataTemp = [
      {
          name: 'Air Temp',
          data: latestMachineData.map((d) => d.airTemp)
      },
      {
          name: 'Process Temp',
          data: latestMachineData.map((d) => d.processTemp)
      }
  ];

  const chartOptionsTemp: any = {
      chart: {
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
        },
        onDatasetHover: {
          style: {
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
          },
        },
        theme: 'dark',
      },
      xaxis: {
        categories: latestMachineData.map((d) => {
            // Safe access to nested property
            // @ts-expect-error machine might be populated
            return d.machine?.name?.replace('Machine', '') || d.productId || 'Unknown';
        }),
        show: false,
        labels: {
          show: true,
          style: {
            colors: '#A3AED0',
            fontSize: '14px',
            fontWeight: '500',
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: true,
        color: 'black',
        labels: {
          show: true,
          style: {
            colors: '#A3AED0',
            fontSize: '14px',
          },
        },
      },
      grid: {
        strokeDashArray: 5,
        yaxis: {
          lines: {
            show: true,
          },
        },
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      fill: {
        type: 'solid',
        gradient: {
          type: 'vertical',
          shadeIntensity: 0.5,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          colorStops: [
            [
              {
                offset: 0,
                color: '#4318FF',
                opacity: 1,
              },
              {
                offset: 100,
                color: 'rgba(67, 24, 255, 1)',
                opacity: 0.28,
              },
            ],
          ],
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '40px',
        },
      },
  };
  
  // Format data for table
  // We want to show latest readings for each machine
  const tableData = latestMachineData.map((d) => ({
      name: [d.machineId, d.productId], // Using array to match some table expectations or just passing data
      status: 'Active', 
      date: new Date(d.timestamp).toLocaleDateString(),
      progress: d.toolWear
  }));

  // Row Colors
  const rowBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const rowHover = useColorModeValue('gray.100', 'whiteAlpha.100');

  return (
    <Box pt={{ base: '130px', md: '20px', xl: '20px' }}>
      <Flex mb="20px" justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              Smart Factory Overview
          </Text>
      </Flex>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={MdBarChart} color="white" />}
            />
          }
          name="Total Machines"
          value={machineCount || "..."}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Avg Air Temp"
          value={`${avgAirTemp} K`}
        />
        <MiniStatistics 
            startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAddTask} color={brandColor} />
              }
            />
          }
            name="Avg Process Temp" 
            value={`${avgProcessTemp} K`} 
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name="Avg Rotation Speed"
          value={`${avgRotationalSpeed} RPM`}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 1, xl: 1 }} gap="20px" mb="20px">
        {/* Main Chart */}
        <Box
            p='20px'
            alignItems='center'
            flexDirection='column'
            w='100%'
            bg={useColorModeValue('white', 'navy.700')}
            borderRadius='20px'>
            <Flex justify='space-between' align='center' mb='20px'>
               <Text color={textColor} fontSize='lg' fontWeight='700'>
                  Real-time Temperature Comparison
               </Text>
            </Flex>
            <Box h='300px'>
                {latestMachineData.length > 0 && (
                     <BarChart
                        chartData={chartDataTemp}
                        chartOptions={chartOptionsTemp}
                    />
                )}
            </Box>
        </Box>
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1 }} gap="20px" mb="20px">
        <Box
          p='20px' 
          bg={useColorModeValue('white', 'navy.700')}
          borderRadius='20px'
        >
             <Flex justify="space-between" mb="20px" align="center">
                <Text color={textColor} fontSize='lg' fontWeight='700'>
                    Recent Machine Status
                </Text>
             </Flex>
             
             {/* Header Row */}
             <SimpleGrid columns={{ base: 2, md: 4 }} gap="20px" mb="10px" px="10px">
                <Text color="gray.400" fontSize="xs" fontWeight="bold" textTransform="uppercase">Machine Name</Text>
                <Text color="gray.400" fontSize="xs" fontWeight="bold" textTransform="uppercase" display={{ base: "none", md: "block" }}>RPM</Text>
                <Text color="gray.400" fontSize="xs" fontWeight="bold" textTransform="uppercase" textAlign="right">Tool Wear</Text>
                <Text color="gray.400" fontSize="xs" fontWeight="bold" textTransform="uppercase" textAlign="right">Last Update</Text>
             </SimpleGrid>

             <SimpleGrid columns={1} gap="10px">
                {latestMachineData.map((machine, i) => (
                    <Box 
                        key={i} 
                        p="15px" 
                        borderRadius="15px"
                        bg={rowBg}
                        transition="all 0.2s"
                        _hover={{ bg: rowHover }}
                    >
                        <SimpleGrid columns={{ base: 2, md: 4 }} gap="20px" alignItems="center">
                             <Flex align="center" gap="10px">
                                 <IconBox
                                    w="30px"
                                    h="30px"
                                    bg="linear-gradient(135deg, #868CFF 0%, #4318FF 100%)"
                                    icon={<Icon as={MdBarChart} w="16px" h="16px" color="white" />}
                                    boxShadow="0px 5px 10px rgba(67, 24, 255, 0.1)"
                                 />
                                 <Text fontWeight="bold" color={textColor} fontSize="sm">
                                    {/* @ts-expect-error machine populated */}
                                    {machine.machine?.name || machine.productId}
                                 </Text>
                             </Flex>
                             
                             <Text fontSize="sm" color="gray.500" display={{ base: "none", md: "block" }}>
                                {machine.rotationalSpeed} RPM
                             </Text>
                             
                             <Text fontWeight="bold" color="brand.500" textAlign="right">
                                {machine.toolWear.toFixed(3)}
                             </Text>
                             
                             <Text fontSize="sm" color="gray.500" textAlign="right">
                                {new Date(machine.timestamp).toLocaleTimeString()}
                             </Text>
                        </SimpleGrid>
                    </Box>
                ))}
             </SimpleGrid>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
