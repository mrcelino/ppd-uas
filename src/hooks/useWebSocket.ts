import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
  namespace: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useWebSocket = (options: UseWebSocketOptions) => {
  const { namespace, onConnect, onDisconnect, onError } = options;
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_API_WS_URL;
    if (!wsUrl) {
      console.error('WebSocket URL not configured');
      return;
    }

    console.log('Connecting to WebSocket:', `${wsUrl}${namespace}`);

    const socket = io(`${wsUrl}${namespace}`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      onConnect?.();
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      onDisconnect?.();
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
      onError?.(error);
    });

    return () => {
      console.log('Cleaning up WebSocket connection');
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [namespace, onConnect, onDisconnect, onError]);

  const emit = (event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.on(event, handler);
  };

  const off = (event: string, handler?: (...args: any[]) => void) => {
    socketRef.current?.off(event, handler);
  };

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off,
  };
};
