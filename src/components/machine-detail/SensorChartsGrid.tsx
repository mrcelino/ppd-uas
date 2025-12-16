import {
  Flex,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { SensorChart } from './SensorChart';

interface ChartData {
  timestamps: string[];
  values: number[];
}

interface SensorChartsGridProps {
  airTempData: ChartData;
  processTempData: ChartData;
  rotationalSpeedData: ChartData;
  torqueData: ChartData;
  toolWearData: ChartData;
  hasData: boolean;
}

export const SensorChartsGrid = ({
  airTempData,
  processTempData,
  rotationalSpeedData,
  torqueData,
  toolWearData,
  hasData,
}: SensorChartsGridProps) => {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.700');
  const shadowColor = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );

  return (
    <>
      <Heading size="md" color={textColor} mb="20px">
        Sensor Data Overview
      </Heading>

      {!hasData ? (
        <Card bg={cardBg} boxShadow={shadowColor} p="40px">
          <Flex justify="center" align="center" direction="column" gap="10px">
            <Text color={textColor} fontSize="lg">
              No sensor data available
            </Text>
            <Text color={textColorSecondary} fontSize="sm">
              This machine doesn&apos;t have any sensor readings yet.
            </Text>
          </Flex>
        </Card>
      ) : (
        <SimpleGrid columns={1} gap="20px">
          <SensorChart
            title="Air Temperature (K)"
            unit="K"
            data={airTempData.values}
            timestamps={airTempData.timestamps}
            color="#4318FF"
          />

          <SensorChart
            title="Process Temperature (K)"
            unit="K"
            data={processTempData.values}
            timestamps={processTempData.timestamps}
            color="#FF6B00"
          />

          <SensorChart
            title="Rotational Speed (RPM)"
            unit="RPM"
            data={rotationalSpeedData.values}
            timestamps={rotationalSpeedData.timestamps}
            color="#01B574"
          />

          <SensorChart
            title="Torque (Nm)"
            unit="Nm"
            data={torqueData.values}
            timestamps={torqueData.timestamps}
            color="#FFB547"
          />

          <SensorChart
            title="Tool Wear (min)"
            unit="min"
            data={toolWearData.values}
            timestamps={toolWearData.timestamps}
            color="#EE5D50"
          />
        </SimpleGrid>
      )}
    </>
  );
};
