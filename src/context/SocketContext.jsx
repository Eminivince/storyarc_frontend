import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { getAccessToken } from "../auth/authStorage";

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:4000";

export function SocketProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    const token = getAccessToken();

    if (!token) {
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isAuthenticated]);

  const value = {
    isConnected,
    socket: socketRef.current,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);

  if (!context) {
    return { isConnected: false, socket: null };
  }

  return context;
}

export function useSocketEvent(event, handler) {
  const { socket } = useSocket();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!socket) return;

    const listener = (...args) => handlerRef.current(...args);
    socket.on(event, listener);

    return () => {
      socket.off(event, listener);
    };
  }, [socket, event]);
}
