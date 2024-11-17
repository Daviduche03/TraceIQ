export interface ErrorEvent {
  message: string;
  type: string;
  stack?: string;
  browser?: {
    name: string;
    version: string;
  };
  os?: {
    name: string;
    version: string;
  };
  severity?: 'critical' | 'error' | 'warning';
  status?: 'open' | 'resolved' | 'ignored';
  environment: string;
  created_at?: string;
  metadata?: Record<string, any>;  // Add this line
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}