import { useEffect, useRef } from "react";
import useStudentStore from "../store/studentStore";
import type { WsMessage } from "../types";

const WS_URL = "ws://localhost:5000";

export function useWebSocket(): void {
  const setStudents = useStudentStore((s) => s.setStudents);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("useWebSocket: connecting to", WS_URL);
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("useWebSocket/onopen: connected");
    };

    ws.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data as string);
        console.log("useWebSocket/onmessage: type=", msg.type, "count=", msg.data.length);
        if (msg.type === "update") {
          setStudents(msg.data);
        }
      } catch (err) {
        console.error("useWebSocket/onmessage error:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("useWebSocket/onerror:", err);
    };

    ws.onclose = () => {
      console.log("useWebSocket/onclose: disconnected");
    };

    return () => {
      console.log("useWebSocket: cleanup, closing connection");
      ws.close();
    };
  }, [setStudents]);
}
