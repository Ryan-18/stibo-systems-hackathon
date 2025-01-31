export interface SecretResponse {
  apiKey: string;
}

export interface ConnectionStatus {
  status: 'idle' | 'connecting' | 'connected' | 'error';
  message?: string;
}