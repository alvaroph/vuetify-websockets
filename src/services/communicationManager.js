
class CommunicationManager {
  constructor() {
    if (CommunicationManager.instance) {
      return CommunicationManager.instance;
    }

    this.socket = null;
    this.listeners = [];
    this.connect();

    CommunicationManager.instance = this;
  }

  connect() {
    this.socket = new WebSocket('ws://localhost:8080');

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onmessage = (event) => {
      this.listeners.forEach(listener => listener(event.data));
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  sendMessage(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  async fetchFromOMDb(query) {
    const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=19f8a30e`);
    const data = await response.json();
    return data;
  }
}

const instance = new CommunicationManager();
export default instance;
