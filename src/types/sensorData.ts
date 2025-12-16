export interface SensorData {
  udi: number;
  machineId: string;
  productId: string;
  timestamp: string;
  airTemp: number;
  processTemp: number;
  rotationalSpeed: number;
  torque: number;
  toolWear: number;
  createdAt: string;
  machine?: {
    id: string;
    productId: string;
    name: string;
    type: string;
  };
}

export interface Machine {
  id: string;
  productId: string;
  type: string;
  name: string;
  description: string;
  location: string;
  installationDate: string;
  lastMaintenanceDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
