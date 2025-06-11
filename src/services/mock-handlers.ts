import { http, HttpResponse } from 'msw';

// Mock data stores
const anonymousCodes = new Set<string>();
const pendingVerifications = new Map<string, number>();
const VALID_PIN = 123456;

// Helper functions
function generateRandomCode(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

function generateSessionToken(): string {
  return Array.from({ length: 64 }, () => 
    '0123456789abcdef'[Math.floor(Math.random() * 16)]
  ).join('');
}

export const handlers = [
  // Anonymous registration
  http.post('/api/v1/user/register/code', async () => {
    const loginCode = generateRandomCode(16);
    anonymousCodes.add(loginCode);
    
    return HttpResponse.json({
      data: {
        login_code: loginCode
      }
    }, { status: 200 });
  }),

  // Email registration
  http.post('/api/v1/user/register/email', async ({ request }) => {
    const body = await request.json() as { email: string; lang: string };
    
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return HttpResponse.json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email validation failed',
          details: [
            {
              field: 'email',
              message: 'Email address format is incorrect'
            }
          ]
        }
      }, { status: 422 });
    }

    pendingVerifications.set(body.email, VALID_PIN);
    
    return HttpResponse.json({
      data: []
    }, { status: 200 });
  }),

  http.post('/api/v1/auth/login/email', async ({ request }) => {
    const body = await request.json() as { email: string; pincode: number };
    
    if (!pendingVerifications.has(body.email)) {
      return HttpResponse.json({
        error: {
          code: 'WRONG_PIN_CODE',
          message: 'PIN code expired or missing'
        }
      }, { status: 401 });
    }
    
    if (pendingVerifications.get(body.email) !== body.pincode) {
      return HttpResponse.json({
        error: {
          code: 'WRONG_PIN_CODE',
          message: 'PIN code expired or missing'
        }
      }, { status: 401 });
    }

    pendingVerifications.delete(body.email);
    
    return HttpResponse.json({
      data: {
        session: generateSessionToken()
      }
    }, { status: 200 });
  }),

  // Code login
  http.post('/api/v1/auth/login/code', async ({ request }) => {
    const body = await request.json() as { login_code: string };
    
    if (!anonymousCodes.has(body.login_code)) {
      return HttpResponse.json({
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Authentication error'
        }
      }, { status: 401 });
    }
    
    return HttpResponse.json({
      data: {
        session: generateSessionToken()
      }
    }, { status: 200 });
  }),

  // Google auth
  http.post('/api/v1/user/register/google_account', async () => {
    return HttpResponse.json({
      data: {
        session: generateSessionToken()
      }
    }, { status: 200 });
  }),
];