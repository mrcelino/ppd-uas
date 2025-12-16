import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Badge,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { MdLocationOn, MdDateRange, MdSettings, MdDataUsage } from 'react-icons/md';
import Card from 'components/card/Card';
import { Machine } from 'types/sensorData';

interface MachineDetailsCardProps {
  machine: Machine;
  dataPointsCount: number;
}

export const MachineDetailsCard = ({
  machine,
  dataPointsCount,
}: MachineDetailsCardProps) => {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'navy.700');
  
  // Status Logic
  const statusColor =
    machine.status === 'operational'
      ? 'green'
      : machine.status === 'maintenance'
      ? 'yellow'
      : 'red';

  const InfoItem = ({ label, value, icon }: { label: string; value: string | number; icon?: any }) => (
      <Box>
          <Text color={textColorSecondary} fontSize="xs" fontWeight="bold" textTransform="uppercase" mb="4px">
            {label}
          </Text>
          <Flex align="center" gap="8px">
             {icon && <Icon as={icon} color="brand.500" w="18px" h="18px" />}
             <Text color={textColor} fontSize="md" fontWeight="700">
               {value}
             </Text>
          </Flex>
      </Box>
  );

  return (
    <Card p="24px" bg={cardBg} mb="20px" borderRadius="20px">
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "start", md: "center" }} mb="24px">
            <Box>
                <Text color={textColor} fontSize="2xl" fontWeight="bold" mb="4px">
                   {machine.name}
                </Text> 
                <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
                   Product ID: {machine.productId}
                </Text>
            </Box>
             <Badge
                colorScheme={statusColor}
                fontSize="sm"
                px="14px"
                py="6px"
                borderRadius="12px"
                textTransform="uppercase"
                fontWeight="700"
            >
                {machine.status}
            </Badge>
        </Flex>

        <Box mb="24px">
             <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
                {machine.description || 'No description available for this machine unit.'}
             </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 4 }} gap="24px">
             <InfoItem label="Machine Type" value={machine.type} icon={MdSettings} />
             <InfoItem label="Location" value={machine.location} icon={MdLocationOn} />
             <InfoItem label="Installed Date" value={new Date(machine.installationDate).toLocaleDateString()} icon={MdDateRange} />
             <InfoItem label="Total Data Points" value={dataPointsCount.toLocaleString()} icon={MdDataUsage} />
        </SimpleGrid>
    </Card>
  );
};
