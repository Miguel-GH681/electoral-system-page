import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const VoteSocket = (serverUrl : string, token : string)=>{
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketTemp = io(serverUrl, {
      extraHeaders: {
        "x-token": token
      }
    });

    setSocket(socketTemp);

    return () => {
      socketTemp.disconnect();
    };
  }, [serverUrl, token]);

  return socket;
}
