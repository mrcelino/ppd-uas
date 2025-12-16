import { Box, Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card';

interface SimulatorControlsProps {
  machineId: string;
  isSimulatorRunning: boolean;
  startNormalLoading: boolean;
  startAnomalyLoading: boolean;
  stopLoading: boolean;
  onStartNormal: () => void;
  onStartAnomaly: (machineId: string) => void;
  onStop: () => void;
}

export const SimulatorControls = ({
  machineId,
  isSimulatorRunning,
  startNormalLoading,
  startAnomalyLoading,
  stopLoading,
  onStartNormal,
  onStartAnomaly,
  onStop,
}: SimulatorControlsProps) => {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.700');
  const shadowColor = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );

  return (
    <Card bg={cardBg} boxShadow={shadowColor} mb="20px" p="20px">
      <Flex justify="space-between" align="center" flexWrap="wrap" gap="15px">
        <Box>
          <Text fontSize="md" fontWeight="bold" color={textColor} mb="5px">
            Sensor Data Simulator
          </Text>
          <Text fontSize="sm" color={textColorSecondary}>
            Test sensor data generation for development and testing
          </Text>
        </Box>
        <Flex gap="10px" flexWrap="wrap">
          <Button
            colorScheme="blue"
            size="sm"
            onClick={onStartNormal}
            isLoading={startNormalLoading}
            isDisabled={isSimulatorRunning}
          >
            Start Normal
          </Button>
          <Button
            colorScheme="orange"
            size="sm"
            onClick={() => onStartAnomaly(machineId)}
            isLoading={startAnomalyLoading}
            isDisabled={isSimulatorRunning}
          >
            Start Failures
          </Button>
          <Button
            colorScheme="red"
            size="sm"
            onClick={onStop}
            isLoading={stopLoading}
            isDisabled={!isSimulatorRunning}
          >
            Stop Simulator
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};
