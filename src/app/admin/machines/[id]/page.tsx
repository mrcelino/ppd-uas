'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import { useSensorWebSocket } from 'hooks/useSensorWebSocket';
import { useSimulator } from 'hooks/useSimulator';
import { SensorData, Machine } from 'types/sensorData';
import { MachineHeader } from 'components/machine-detail/MachineHeader';
import { SimulatorControls } from 'components/machine-detail/SimulatorControls';
import { MachineDetailsCard } from 'components/machine-detail/MachineDetailsCard';
import { SensorChartsGrid } from 'components/machine-detail/SensorChartsGrid';
import {
  PredictionResultCard,
  PredictionResult,
} from 'components/machine-detail/PredictionResultCard';

export default function MachineDetail() {
  const params = useParams();
  const router = useRouter();
  const machineId = params.id as string;

  const [machine, setMachine] = useState<Machine | null>(null);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prediction state
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] =
    useState<PredictionResult | null>(null);

  const toast = useToast();
  const brandColor = useColorModeValue('brand.500', 'white');
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');

  // Custom hooks
  const {
    isSimulatorRunning,
    startNormalLoading,
    startAnomalyLoading,
    stopLoading,
    startNormalSimulator,
    startAnomalySimulator,
    stopSimulator,
  } = useSimulator();

  const handlePredict = async () => {
    console.log('Predict button clicked');
    
    if (!machine) {
      console.error('Machine data missing');
      return;
    }

    if (!sensorData || sensorData.length === 0) {
      console.warn('No sensor data available for prediction');
      toast({
        title: 'No Sensor Data',
        description: 'Please START the simulator to generate data for prediction.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    // Get latest sensor data (first item in array since it's unshifted)
    const latestData = sensorData[0];

    setIsPredicting(true);
    setPredictionResult(null);

    try {
      const payload = {
        type: machine.type || 'L', // Default to L if type is missing
        air_temperature: latestData.airTemp,
        process_temperature: latestData.processTemp,
        rotational_speed: latestData.rotationalSpeed,
        torque: latestData.torque,
        tool_wear: latestData.toolWear,
      };

      console.log('Sending prediction payload:', payload);

      const response = await fetch('https://ujiajh-api-ppd.hf.space/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Prediction failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Prediction result:', result);

      // Simulate delay for better UX if response is too fast
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPredictionResult(result);
    } catch (error) {
      console.error('Prediction error:', error);
      toast({
        title: 'Prediction Error',
        description:
          'Failed to get prediction from AI model. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const handleSensorUpdate = useCallback((data: SensorData) => {
    console.log('Received sensor update in component:', data);

    if (!data || typeof data.airTemp === 'undefined') {
      console.warn('Invalid sensor data received:', data);
      return;
    }

    setSensorData((prevData) => {
      const newData = [data, ...prevData].slice(0, 30);
      console.log('Updated sensor data array, length:', newData.length);
      return newData;
    });
  }, []);

  const { isConnected } = useSensorWebSocket({
    machineId,
    onSensorUpdate: handleSensorUpdate,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!machineId) return;

      try {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const token = localStorage.getItem('accessToken');

        const [machineResponse, sensorResponse] = await Promise.all([
          fetch(`${apiUrl}/machines/${machineId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${apiUrl}/sensors?limit=30&offset=0&machineId=${machineId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        if (!machineResponse.ok) {
          throw new Error(`Failed to fetch machine: ${machineResponse.status}`);
        }

        const machineData = await machineResponse.json();
        const sensorDataResult = await sensorResponse.json();

        setMachine(machineData.data || machineData);
        setSensorData(sensorDataResult.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load machine data');
        toast({
          title: 'Error',
          description: 'Failed to load machine data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [machineId, toast]);

  const prepareChartData = (
    dataKey: keyof Pick<
      SensorData,
      'airTemp' | 'processTemp' | 'rotationalSpeed' | 'torque' | 'toolWear'
    >,
  ) => {
    if (!sensorData || sensorData.length === 0) {
      return { timestamps: [], values: [] };
    }

    const sortedData = [...sensorData].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    const timestamps = sortedData.map((d) =>
      new Date(d.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    );

    const values = sortedData.map((d) => {
      const value = d[dataKey];
      return value !== undefined && value !== null
        ? Number(value.toFixed(2))
        : 0;
    });

    return { timestamps, values };
  };

  if (loading) {
    return (
      <Box pt={{ base: '20px', md: '20px', xl: '20px' }}>
        <Flex
          justify="center"
          align="center"
          minH="400px"
          direction="column"
          gap="20px"
        >
          <Spinner size="xl" color={brandColor} thickness="4px" />
          <Text color={textColorSecondary} fontSize="sm">
            Loading machine details...
          </Text>
        </Flex>
      </Box>
    );
  }

  if (error || !machine) {
    return (
      <Box pt={{ base: '20px', md: '20px', xl: '20px' }}>
        <Flex
          justify="center"
          align="center"
          minH="400px"
          direction="column"
          gap="20px"
        >
          <Text color={textColor} fontSize="lg">
            {error || 'Machine not found'}
          </Text>
          <Button onClick={() => router.push('/admin/machines')}>
            Back to Machines
          </Button>
        </Flex>
      </Box>
    );
  }

  const airTempData = prepareChartData('airTemp');
  const processTempData = prepareChartData('processTemp');
  const rotationalSpeedData = prepareChartData('rotationalSpeed');
  const torqueData = prepareChartData('torque');
  const toolWearData = prepareChartData('toolWear');

  return (
    <Box pt={{ base: '130px', md: '20px', xl: '20px' }}>
      <MachineHeader isConnected={isConnected} />

      <MachineDetailsCard
        machine={machine}
        dataPointsCount={sensorData.length}
      />

      <Grid
        templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
        gap="20px"
        mb="20px"
      >
        <SimulatorControls
          machineId={machineId}
          isSimulatorRunning={isSimulatorRunning}
          startNormalLoading={startNormalLoading}
          startAnomalyLoading={startAnomalyLoading}
          stopLoading={stopLoading}
          onStartNormal={startNormalSimulator}
          onStartAnomaly={startAnomalySimulator}
          onStop={stopSimulator}
        />

        <PredictionResultCard
          result={predictionResult}
          isLoading={isPredicting}
          onPredict={handlePredict}
        />
      </Grid>

      <SensorChartsGrid
        airTempData={airTempData}
        processTempData={processTempData}
        rotationalSpeedData={rotationalSpeedData}
        torqueData={torqueData}
        toolWearData={toolWearData}
        hasData={sensorData.length > 0}
      />
    </Box>
  );
}
