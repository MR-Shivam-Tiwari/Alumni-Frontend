// webSocketUtility.js
import { useDispatch, useSelector } from 'react-redux';
import { closeWebSocket } from '../store/webSocketSlice';

const WebSocketUtility = () => {
  const dispatch = useDispatch();
  const wsUrl = useSelector((state) => state.webSocket.wsUrl);

  let ws;

  const connectWebSocket = () => {
    if (!ws || ws.readyState === WebSocket.CLOSED) {
        console.log('ws open')
      ws = new WebSocket(wsUrl);

      // Additional WebSocket setup...

      // Ensure closeWebSocket is called when the connection is closed unexpectedly
      ws.onclose = () => {
        dispatch(closeWebSocket());
      };

      return ws;
    }

    return ws;
  };


  const closeWebSocket = () => {
    if (ws) {
      ws.close();
    }
    dispatch(closeWebSocket());
  };

  return { connectWebSocket, closeWebSocket };
};

export default WebSocketUtility;
