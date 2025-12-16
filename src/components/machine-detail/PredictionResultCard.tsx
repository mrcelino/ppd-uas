import {
  Box,
  Button,
  Flex,
  Text,
  Icon,
  useColorModeValue,
  Spinner,
  Badge,
  VStack,
} from '@chakra-ui/react';
import {
  MdPsychology,
  MdCheckCircle,
  MdWarning,
  MdError,
  MdRefresh,
} from 'react-icons/md';
import Card from 'components/card/Card';

export interface PredictionResult {
  status: 'normal' | 'anomaly' | 'failure';
  prediction?: string;
  message?: string;
  failure_type?: string;
  failure_code?: number;
}

interface PredictionResultCardProps {
  result: PredictionResult | null;
  isLoading: boolean;
  onPredict: () => void;
}

export const PredictionResultCard = ({
  result,
  isLoading,
  onPredict,
}: PredictionResultCardProps) => {
  const cardBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const shadowColor = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );

  // Status Colors
  const normalColor = useColorModeValue('green.500', 'green.300');
  const anomalyColor = useColorModeValue('orange.500', 'orange.300');
  const failureColor = useColorModeValue('red.500', 'red.300');
  const normalBg = useColorModeValue('green.50', 'rgba(72, 187, 120, 0.1)');
  const anomalyBg = useColorModeValue('orange.50', 'rgba(237, 137, 54, 0.1)');
  const failureBg = useColorModeValue('red.50', 'rgba(245, 101, 101, 0.1)');

  const getStatusConfig = () => {
    if (!result) return null;
    const status = result.status?.toLowerCase();

    switch (status) {
      case 'normal':
        return {
          color: normalColor,
          bg: normalBg,
          icon: MdCheckCircle,
          title: 'System Healthy',
          desc: 'No failures detected. Machine operating normally.',
        };
      case 'anomaly':
        return {
          color: anomalyColor,
          bg: anomalyBg,
          icon: MdWarning,
          title: 'Anomaly Detected',
          desc: result.message || 'Unusual sensor patterns detected.',
        };
      case 'failure':
        return {
          color: failureColor,
          bg: failureBg,
          icon: MdError,
          title: 'Failure Detected',
          desc: `Critical Issue: ${result.failure_type || 'Unknown Failure'}`,
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <Card p="20px" bg={cardBg} boxShadow={shadowColor} h="100%" display="flex" justifyContent="center">
      <Flex align="center" justify="space-between" width="100%">
        <Flex align="center" gap="12px">
          {isLoading ? (
            <Spinner size="md" color="brand.500" thickness="3px" />
          ) : (
            <Box
              p="10px"
              borderRadius="10px"
              bg={statusConfig ? statusConfig.bg : 'brand.50'}
              color={statusConfig ? statusConfig.color : 'brand.500'}
            >
              <Icon
                as={statusConfig ? statusConfig.icon : MdPsychology}
                w="24px"
                h="24px"
              />
            </Box>
          )}

          <VStack align="flex-start" spacing="0">
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              {isLoading
                ? 'Analyzing Sensor Data...'
                : statusConfig
                ? statusConfig.title
                : 'AI Health Diagnostics'}
            </Text>
            <Text fontSize="sm" color={textColorSecondary}>
              {isLoading
                ? 'Processing real-time telemetry...'
                : statusConfig
                ? statusConfig.desc
                : 'Run diagnostics to check machine health status'}
            </Text>
          </VStack>
        </Flex>

        <Button
          leftIcon={<Icon as={result ? MdRefresh : MdPsychology} />}
          colorScheme={
            statusConfig?.title === 'Failure Detected' ? 'red' : 'brand'
          }
          variant="solid"
          onClick={onPredict}
          isLoading={isLoading}
          loadingText="Analyzing"
          size="md"
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
        >
          {result ? 'Run Again' : 'Predict Health'}
        </Button>
      </Flex>

      {/* Detail Failure Information if applicable */}
      {statusConfig?.title === 'Failure Detected' && result?.failure_code && (
        <Box mt="16px" p="12px" bg={failureBg} borderRadius="lg">
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" fontWeight="bold" color={failureColor}>
              Failure Code: {result.failure_code}
            </Text>
            <Badge colorScheme="red">CRITICAL</Badge>
          </Flex>
        </Box>
      )}
    </Card>
  );
};
