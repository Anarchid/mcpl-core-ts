/**
 * Error types for MCPL connections.
 */

export class ConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConnectionError';
  }
}

export class ConnectionClosedError extends ConnectionError {
  constructor() {
    super('Connection closed');
    this.name = 'ConnectionClosedError';
  }
}

export class ConnectionTimeoutError extends ConnectionError {
  constructor() {
    super('Request timed out');
    this.name = 'ConnectionTimeoutError';
  }
}

export class RpcError extends ConnectionError {
  readonly code: number;

  constructor(code: number, message: string) {
    super(`RPC error ${code}: ${message}`);
    this.name = 'RpcError';
    this.code = code;
  }
}
