import {
  Box,
  Text,
  useColorModeValue,
  Flex,
  Badge,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';

interface SensorChartProps {
  title: string;
  unit: string;
  data: number[];
  timestamps: string[];
  color: string;
}

export const SensorChart = ({
  title,
  unit,
  data,
  timestamps,
  color,
}: SensorChartProps) => {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const shadowColor = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );
  const gradientBg = useColorModeValue(
    `linear-gradient(180deg, ${color}15 0%, rgba(255,255,255,0) 100%)`,
    `linear-gradient(180deg, ${color}25 0%, rgba(255,255,255,0) 100%)`,
  );
  const statBg = useColorModeValue('white', 'navy.700');
  const statBorder = useColorModeValue('gray.100', 'whiteAlpha.100');

  // Calculate stats
  const currentValue = data[data.length - 1] || 0;
  const previousValue = data[data.length - 2] || currentValue;
  const minValue = Math.min(...data.filter((v) => v > 0));
  const maxValue = Math.max(...data);
  const avgValue = data.reduce((a, b) => a + b, 0) / data.length;
  const trend = currentValue > previousValue ? 'increase' : 'decrease';
  const trendPercent = previousValue
    ? Math.abs(((currentValue - previousValue) / previousValue) * 100)
    : 0;

  const chartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'DM Sans, sans-serif',
      },
      y: {
        formatter: (val: number) => `${val.toFixed(2)} ${unit}`,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth' as const,
      width: 6,
    },
    xaxis: {
      categories: timestamps,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: textColorSecondary,
          fontSize: '11px',
          fontWeight: 600,
        },
        formatter: (val: number) => val.toFixed(0),
      },
    },
    legend: {
      show: false,
    },
    grid: {
      strokeDashArray: 3,
      borderColor: borderColor,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10,
      },
    },
    fill: {
      type: 'solid',
      opacity: 0.85,
      colors: [color],
    },
    colors: [color],
  };

  return (
    <Card
      bg={cardBg}
      boxShadow={shadowColor}
      p="24px"
      borderRadius="20px"
      position="relative"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: useColorModeValue(
          '0px 24px 50px rgba(112, 144, 176, 0.18)',
          '0px 24px 50px rgba(0, 0, 0, 0.4)',
        ),
      }}
    >
      {/* Gradient Background */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="120px"
        bgGradient={gradientBg}
        borderRadius="20px 20px 0 0"
        zIndex={0}
      />

      {/* Header with Stats */}
      <Flex
        justify="space-between"
        align="flex-start"
        mb="20px"
        position="relative"
        zIndex={1}
      >
        <Box>
          <Text
            fontSize="md"
            fontWeight="500"
            color={textColorSecondary}
            mb="4px"
          >
            {title}
          </Text>
          <Flex align="baseline" gap="8px">
            <Text fontSize="3xl" fontWeight="bold" color={textColor}>
              {currentValue.toFixed(1)}
            </Text>
            <Text fontSize="md" fontWeight="500" color={textColorSecondary}>
              {unit}
            </Text>
          </Flex>
          <Flex align="center" gap="6px" mt="4px" mb="12px">
            <Icon
              as={trend === 'increase' ? MdTrendingUp : MdTrendingDown}
              color={trend === 'increase' ? 'green.500' : 'red.500'}
              w="16px"
              h="16px"
            />
            <Text
              fontSize="sm"
              fontWeight="600"
              color={trend === 'increase' ? 'green.500' : 'red.500'}
            >
              {trendPercent.toFixed(1)}%
            </Text>
            <Text fontSize="xs" color={textColorSecondary}>
              vs previous
            </Text>
          </Flex>
        </Box>

        {/* Mini Stats */}
        <Flex gap="8px" flexWrap="wrap" justify="flex-end">
          <Box
            bg={statBg}
            border="1px solid"
            borderColor={statBorder}
            borderRadius="12px"
            px="12px"
            py="6px"
            backdropFilter="blur(10px)"
          >
            <Text fontSize="9px" fontWeight="600" color={textColorSecondary}>
              MIN
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>
              {minValue.toFixed(1)}
            </Text>
          </Box>
          <Box
            bg={statBg}
            border="1px solid"
            borderColor={statBorder}
            borderRadius="12px"
            px="12px"
            py="6px"
            backdropFilter="blur(10px)"
          >
            <Text fontSize="9px" fontWeight="600" color={textColorSecondary}>
              MAX
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>
              {maxValue.toFixed(1)}
            </Text>
          </Box>
          <Box
            bg={statBg}
            border="1px solid"
            borderColor={statBorder}
            borderRadius="12px"
            px="12px"
            py="6px"
            backdropFilter="blur(10px)"
          >
            <Text fontSize="9px" fontWeight="600" color={textColorSecondary}>
              AVG
            </Text>
            <Text fontSize="sm" fontWeight="bold" color={textColor}>
              {avgValue.toFixed(1)}
            </Text>
          </Box>
        </Flex>
      </Flex>

      {/* Chart */}
      <Box h="280px" position="relative" zIndex={1}>
        <LineChart
          chartData={[
            {
              name: title,
              data: data,
            },
          ]}
          chartOptions={chartOptions}
        />
      </Box>
    </Card>
  );
};
