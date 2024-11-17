import type { ErrorEvent, ApiResponse } from "./api-types";

export class ErrorTracker {
  private projectId: string;
  private apiKey: string;
  private environment: string;
  private apiUrl: string;

  constructor(config: {
    projectId: string;
    apiKey: string;
    environment: string;
    apiUrl?: string;
  }) {
    if (!config.projectId || !config.apiKey) {
      throw new Error('Project ID and API key are required. Get these from your TraceIQ dashboard.');
    }
    this.projectId = config.projectId;
    this.apiKey = config.apiKey;
    this.environment = config.environment;
    this.apiUrl = config.apiUrl || 'http://localhost:3000/api';
  }

  async trackError(error: Error | ErrorEvent): Promise<void> {
    const errorEvent: ErrorEvent =
      error instanceof Error
        ? {
            message: error.message,
            type: error.name,
            stack: error.stack,
            severity: "error",
            status: "open",
            environment: this.environment,
          }
        : { ...error, environment: this.environment };

    try {
      const response = await fetch(`${this.apiUrl}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'X-Project-ID': this.projectId,
        },
        body: JSON.stringify(errorEvent),
      });

      if (!response.ok) {
        throw new Error('Failed to send error to TraceIQ');
      }

      const result: ApiResponse = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to send error to TraceIQ');
      }
    } catch (err) {
      console.error("Failed to send error to TraceIQ:", err);
      // Store failed requests in localStorage for retry
      this.storeFailedRequest(errorEvent);
    }
  }

  async getErrors(): Promise<ErrorEvent[]> {
    try {
      const response = await fetch(`${this.apiUrl}/errors/${this.projectId}`, {
        headers: {
          'X-API-Key': this.apiKey,
          'X-Project-ID': this.projectId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch errors from TraceIQ');
      }

      const result: ApiResponse<ErrorEvent[]> = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch errors from TraceIQ');
      }

      return result.data || [];
    } catch (err) {
      console.error("Failed to fetch errors:", err);
      throw err;
    }
  }

  async updateErrorStatus(errorId: string, status: 'open' | 'resolved' | 'ignored'): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/errors/${errorId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'X-Project-ID': this.projectId,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update error status');
      }

      const result: ApiResponse = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update error status');
      }
    } catch (err) {
      console.error("Failed to update error status:", err);
      throw err;
    }
  }

  private storeFailedRequest(errorEvent: ErrorEvent): void {
    const failedRequests = JSON.parse(
      localStorage.getItem("errortracker_failed_requests") || "[]"
    );
    failedRequests.push({
      errorEvent,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(
      "errortracker_failed_requests",
      JSON.stringify(failedRequests)
    );
  }
}
