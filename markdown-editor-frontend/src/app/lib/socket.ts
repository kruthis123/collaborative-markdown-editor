import { store } from "@/store/store";
import { applyInsert, applyDelete, incrementRemoteVersion } from "@/store/markdown-slice";

const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_SERVER_URL || 'ws://192.168.68.50:8000';

let socket: WebSocket | null = null;
let remoteOpCallback: ((op: { type: string; index: number; char?: string; length?: number }) => void) | null = null;

export const setRemoteOpCallback = (callback: (op: { type: string; index: number; char?: string; length?: number }) => void) => {
  remoteOpCallback = callback;
};

export const clearRemoteOpCallback = () => {
  remoteOpCallback = null;
};

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
    store.dispatch(applyInsert({ index: op.index, char: op.char, id: op.id }));
  } else if (op.type === 'delete') {
    store.dispatch(applyDelete({ index: op.index, length: op.length }));
  }

  // Increment remote version to signal EditorPanel to sync
  store.dispatch(incrementRemoteVersion());

  // Notify EditorPanel (currently just sets a flag)
  if (remoteOpCallback) {
    remoteOpCallback(op);
  }
};
