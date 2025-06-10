import { ApiResponse, ApiError } from './api-client';

const VALID_PIN = 123456;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const anonymousCodes = new Set<string>();

const pendingVerifications = new Map<string, number>();

function generateRandomCode(length: number): string {
  return Array.from(
    { length },
    () => Math.floor(Math.random() * 10).toString()
  ).join('');
}

function generateSessionToken(): string {
  return Array.from(
    { length: 64 },
    () => '0123456789abcdef'[Math.floor(Math.random() * 16)]
  ).join('');
}

// Mock API setup
export function setupMockApi(): void {
  const originalFetch = window.fetch;
  
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    // Check if this is an API request that should be mocked
    if (!url.includes('/api/v1')) {
      return originalFetch(input, init);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock API endpoints
    if (url.includes('/api/v1/user/register/code')) {
      return mockRegisterAnonymously();
    }
    
    if (url.includes('/api/v1/user/register/email')) {
      return mockRegisterWithEmail(init);
    }
    
    if (url.includes('/api/v1/auth/login/email')) {
      return mockLoginWithEmail(init);
    }
    
    if (url.includes('/api/v1/auth/login/code')) {
      return mockLoginWithCode(init);
    }
    
    if (url.includes('/api/v1/user/register/google_account')) {
      return mockGoogleAuth();
    }
    
    return originalFetch(input, init);
  };
  
  console.log('🔄 Mock API has been initialized');
}

// API mock implementations
function mockRegisterAnonymously() {
  const loginCode = generateRandomCode(16);
  anonymousCodes.add(loginCode);
  
  const response: ApiResponse<{ login_code: string }> = {
    data: { login_code: loginCode }
  };
  
  return createMockResponse(200, response);
}

function mockRegisterWithEmail(init?: RequestInit) {
  if (!init?.body) {
    return createErrorResponse(422, 'VALIDATION_ERROR', 'Request body is required');
  }
  
  const { email } = JSON.parse(init.body.toString());
  
  if (!email || !EMAIL_REGEX.test(email)) {
    return createErrorResponse(
      422, 
      'VALIDATION_ERROR', 
      'Email validation failed',
      [{ field: 'email', message: 'Email address format is incorrect' }]
    );
  }
  
  // Store a pending verification with the test PIN
  pendingVerifications.set(email, VALID_PIN);
  console.log(`📧 PIN ${VALID_PIN} set for email: ${email}`);
  
  return createMockResponse(200, { data: [] });
}

function mockLoginWithEmail(init?: RequestInit) {
  if (!init?.body) {
    return createErrorResponse(422, 'VALIDATION_ERROR', 'Request body is required');
  }
  
  const { email, pincode } = JSON.parse(init.body.toString());
  
  if (!pendingVerifications.has(email)) {
    return createErrorResponse(401, 'WRONG_PIN_CODE', 'No PIN code requested for this email');
  }
  
  if (pendingVerifications.get(email) !== Number(pincode)) {
    return createErrorResponse(401, 'WRONG_PIN_CODE', 'Incorrect PIN code');
  }
  
  pendingVerifications.delete(email);
  
  const session = generateSessionToken();
  
  return createMockResponse(200, { data: { session } });
}

function mockLoginWithCode(init?: RequestInit) {
  if (!init?.body) {
    return createErrorResponse(422, 'VALIDATION_ERROR', 'Request body is required');
  }
  
  const { login_code } = JSON.parse(init.body.toString());
  
  if (!anonymousCodes.has(login_code)) {
    return createErrorResponse(401, 'AUTHENTICATION_ERROR', 'Invalid login code');
  }

  const session = generateSessionToken();
  
  return createMockResponse(200, { data: { session } });
}

function mockGoogleAuth() {
  const session = generateSessionToken();
  
  return createMockResponse(200, { data: { session } });
}

function createMockResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function createErrorResponse(
  status: number, 
  code: string, 
  message: string,
  details: Array<{ field: string; message: string }> = []
): Response {
  const errorBody: ApiError = {
    error: { code, message, details }
  };
  
  return new Response(JSON.stringify(errorBody), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}