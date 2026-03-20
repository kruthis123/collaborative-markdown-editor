import { store } from "@/store/store";
import { applyInsert, applyDelete, incrementRemoteVersion } from "@/store/markdown-slice";

const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_URL || 'ws://192.168.68.50:8000';

let socket: WebSocket | null = null;

export const getSocket = (): WebSocket => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(wsUrl);
  }
  return socket;
};

export const sendToServer = (message: string) => {
  const ws = getSocket();
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  } else {
    ws.addEventListener('open', () => {
      ws.send(message);
    }, { once: true });
  }
};

getSocket().onmessage = async (event: MessageEvent) => {
  let data = event.data;

  // Handle Blob data by converting to text
  if (data instanceof Blob) {
    data = await data.text();
  }

  const op = JSON.parse(data);

  // Apply to Redux store
  if (op.type === 'insert') {
    store.dispatch(applyInsert({ id: op.id, char: op.char, left: op.left }));
    store.dispatch(incrementRemoteVersion());
  } else if (op.type === 'delete') {
    store.dispatch(applyDelete({ id: op.id }));
    store.dispatch(incrementRemoteVersion());
  }
};
