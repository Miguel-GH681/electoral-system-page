import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const VoteSocket = (serverUrl, token)=>{
  const [socket, setSocket] = useState(null);

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
