class WebSocketService {
  constructor() {
    this.subscribers = new Set();
    this.isSimulated = true; // Enable simulation mode
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect() {
    if (this.isSimulated) {
      console.log('WebSocket simulation mode active');
      // Simulate connection success
      this.notifySubscribers({
        type: 'connection',
        status: 'connected'
      });
      return;
    }

    // Real WebSocket connection code (commented out for now)
    /*
    this.socket = new WebSocket('ws://localhost:8080');

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notifySubscribers(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    */
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(data) {
    this.subscribers.forEach(callback => callback(data));
  }

  send(message) {
    if (this.isSimulated) {
      // Simulate message processing
      console.log('Simulated WebSocket message:', message);
      
      // Simulate server response for certain message types
      if (message.type === 'notification') {
        // Echo back the notification
        setTimeout(() => {
          this.notifySubscribers({
            type: 'notification',
            notification: message.notification
          });
        }, 500);
      }
      return;
    }

    // Real WebSocket send code (commented out for now)
    /*
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
    */
  }

  disconnect() {
    if (this.isSimulated) {
      console.log('WebSocket simulation disconnected');
      return;
    }

    if (this.socket) {
      this.socket.close();
    }
  }
}

export const websocketService = new WebSocketService(); 