import { ref } from 'vue';

const websocketManager = {
  socket: null,
  events: ref([]),
  MAX_EVENTS: 10,

  connect: () => {
    websocketManager.socket = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:8080');

    websocketManager.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocketManager.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const newEvent = { type: message.type, term: message.data };
        websocketManager.events.value.unshift(newEvent);
        if (websocketManager.events.value.length > websocketManager.MAX_EVENTS) {
          websocketManager.events.value.pop();
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    websocketManager.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    websocketManager.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  },

  sendMessage: (type, data) => {
    if (websocketManager.socket && websocketManager.socket.readyState === WebSocket.OPEN) {
      const message = { type, data };
      websocketManager.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }
};

websocketManager.connect();

export default websocketManager;