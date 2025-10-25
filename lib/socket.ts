import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
    auth: { token },
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
