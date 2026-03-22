import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getAccessToken } from "../auth/authStorage";
import { appEnv } from "../config/env";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

/**
 * Socket.IO needs an absolute http(s) origin. Do not derive it with a naive
 * `.replace("/api", "")` on VITE_API_BASE_URL — values like `https/api` become
 * the hostname "https" and the client tries `wss://https/socket.io/`.
 */
function resolveSocketOrigin() {
  const explicit = import.meta.env.VITE_SOCKET_URL?.trim();
  if (explicit) {
    try {
      return new URL(explicit).origin;
    } catch {
      // fall through
    }
  }

  const api = appEnv.apiBaseUrl;
  if (/^https?:\/\//i.test(api)) {
    try {
      return new URL(api).origin;
    } catch {
      return appEnv.backendOrigin;
    }
  }

  return appEnv.backendOrigin;
}

const SOCKET_URL = resolveSocketOrigin();

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
