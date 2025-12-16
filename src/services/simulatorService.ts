const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const simulatorService = {
  startNormal: async (): Promise<void> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${apiUrl}/sensors/simulator/start`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to start normal simulator');
    }

    return response.json();
  },

  startAnomaly: async (machineId: string): Promise<void> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(
      `${apiUrl}/sensors/simulator/anomaly/${machineId}`,
      {
        method: 'POST',
        headers: getHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to start anomaly simulator');
    }

    return response.json();
  },

  stop: async (): Promise<void> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${apiUrl}/sensors/simulator/stop`, {
      method: 'POST',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to stop simulator');
    }

    return response.json();
  },
};
