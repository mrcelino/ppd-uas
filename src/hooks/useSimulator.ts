import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { simulatorService } from 'services/simulatorService';

const SIMULATOR_STATE_KEY = 'simulator_running_state';

export const useSimulator = () => {
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);
  const [startNormalLoading, setStartNormalLoading] = useState(false);
  const [startAnomalyLoading, setStartAnomalyLoading] = useState(false);
  const [stopLoading, setStopLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const toast = useToast();

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(SIMULATOR_STATE_KEY);
    if (savedState === 'true') {
      setIsSimulatorRunning(true);
    }
  }, []);

  const updateSimulatorState = useCallback((running: boolean) => {
    setIsSimulatorRunning(running);
    localStorage.setItem(SIMULATOR_STATE_KEY, running.toString());
  }, []);

  const clearAnomalyInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startNormalSimulator = async () => {
    try {
      setStartNormalLoading(true);

      // Clear any existing anomaly interval
      clearAnomalyInterval();

      await simulatorService.startNormal();

      updateSimulatorState(true);

    } catch (error) {
      console.error('Error starting normal simulator:', error);

    } finally {
      setStartNormalLoading(false);
    }
  };

  const startAnomalySimulator = async (machineId: string) => {
    try {
      setStartAnomalyLoading(true);

      // Clear any existing interval
      clearAnomalyInterval();

      // First call immediately
      await simulatorService.startAnomaly(machineId);

      updateSimulatorState(true);


      // Then set up interval to call every 5 seconds
      intervalRef.current = setInterval(async () => {
        try {
          console.log(
            'Anomaly simulator interval tick - sending data for machine:',
            machineId,
          );
          await simulatorService.startAnomaly(machineId);
        } catch (error) {
          console.error('Error in anomaly simulator interval:', error);
        }
      }, 5000);
    } catch (error) {
      console.error('Error starting anomaly simulator:', error);

    } finally {
      setStartAnomalyLoading(false);
    }
  };

  const stopSimulator = async () => {
    try {
      setStopLoading(true);

      // Clear anomaly interval if running
      clearAnomalyInterval();

      await simulatorService.stop();

      updateSimulatorState(false);
      toast({
        title: 'Simulator Stopped',
        description: 'Sensor data simulation stopped',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error stopping simulator:', error);
      toast({
        title: 'Error',
        description: 'Failed to stop simulator',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setStopLoading(false);
    }
  };

  return {
    isSimulatorRunning,
    startNormalLoading,
    startAnomalyLoading,
    stopLoading,
    startNormalSimulator,
    startAnomalySimulator,
    stopSimulator,
  };
};
