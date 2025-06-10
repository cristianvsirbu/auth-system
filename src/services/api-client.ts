export interface ApiResponse<T = unknown> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

class HttpError extends Error {
  status: number;
  code: string;
  details?: Array<{field: string; message: string}>;

  constructor(status: number, message: string, code: string, details?: Array<{field: string; message: string}>) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.name = 'HttpError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`/api${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const error = data as ApiError;
      throw new HttpError(
        response.status,
        error.error?.message || `API error: ${response.status}`,
        error.error?.code || 'UNKNOWN_ERROR',
        error.error?.details
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
}