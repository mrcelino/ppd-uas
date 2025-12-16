import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useWebSocket } from './useWebSocket';
import { SensorData } from 'types/sensorData';

interface UseSensorWebSocketOptions {
  machineId: string;
  onSensorUpdate: (data: SensorData) => void;
}

export const useSensorWebSocket = ({
  machineId,
  onSensorUpdate,
}: UseSensorWebSocketOptions) => {
  const toast = useToast();

  const { isConnected, emit, on, off } = useWebSocket({
    namespace: '/sensors',
    onConnect: () => {
      console.log('WebSocket connected, subscribing to sensor:', machineId);
      emit('subscribe:sensor', { machineId });

      toast({
        title: 'Connected',
        description: 'Real-time sensor updates enabled',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected');
    },
    onError: (error) => {
      console.error('WebSocket connection error:', error);
    },
  });

  useEffect(() => {
    const handleSubscribed = (data: any) => {
      console.log('Subscribed to sensor updates:', data);
    };

    const handleSensorUpdate = (rawData: any) => {
      console.log('Received sensor update from WebSocket:', rawData);

      // Transform snake_case to camelCase
      const transformedData: SensorData = {
        udi: rawData.udi,
        machineId: rawData.machine_id || rawData.machineId,
        productId: rawData.product_id || rawData.productId,
        timestamp: rawData.timestamp,
        airTemp: rawData.air_temp ?? rawData.airTemp,
        processTemp: rawData.process_temp ?? rawData.processTemp,
        rotationalSpeed: rawData.rotational_speed ?? rawData.rotationalSpeed,
        torque: rawData.torque,
        toolWear: rawData.tool_wear ?? rawData.toolWear,
        createdAt: rawData.created_at || rawData.createdAt || rawData.timestamp,
      };

      console.log('Transformed sensor values:', {
        airTemp: transformedData.airTemp,
        processTemp: transformedData.processTemp,
        rotationalSpeed: transformedData.rotationalSpeed,
        torque: transformedData.torque,
        toolWear: transformedData.toolWear,
      });

      onSensorUpdate(transformedData);
    };

    on('subscribed', handleSubscribed);
    on('sensor:update', handleSensorUpdate);

    return () => {
      off('subscribed', handleSubscribed);
      off('sensor:update', handleSensorUpdate);
      emit('unsubscribe', { machineId });
    };
  }, [machineId, onSensorUpdate, emit, on, off]);

  return { isConnected };
};
