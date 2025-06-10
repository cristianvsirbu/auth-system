# 🔐 Frontend Test Assignment: Mini-Auth System

## 📋 Overview

Build a client-side authentication system with React + TypeScript featuring two login methods:
- Email + PIN code verification
- Anonymous 16-digit access code

**No design required** — clean, responsive layout and quality code are what matter.

## 🛠️ Tech Stack

- **React**
- **Vite**
- **Biome**
- **Vitest**
- **Mock API**

*Starter repository includes pre-configured Vite, Biome, Vitest, and CI pipeline.*

## 🚀 Getting Started

1. **DO NOT fork** the template repository
2. Create your **standalone repository** and copy the template code
3. Develop your solution (unlimited commits allowed)
4. We'll review and run your code in our GitLab CI

### Commands
```bash
npm ci          # Install dependencies
npm run dev     # Start dev server
npm run build   # Production build
npm run check   # Biome lint + type checks
npm run test    # Unit tests
```
**All scripts must pass without errors.**

## 📱 Pages & User Flow

| Route | Purpose |
|-------|---------|
| `/auth` | Login (smart input: email **or** 16-digit code) |
| `/reg` | Registration (email or anonymous) |
| `/auth/email` | Enter 6-digit PIN code |
| `/reg/code` | Display generated anonymous code |

### User Scenarios

**A. Email Registration/Login:**
1. `/reg` → enter email → PIN sent → `/auth/email` → enter PIN → logged in

**B. Anonymous Registration:**
1. `/reg` → "Anonymous registration" → `/reg/code` → save generated code
2. Later: `/auth` → enter saved code → logged in

**C. Returning User:**
1. `/auth` → enter email (triggers PIN) or enter saved anonymous code

## 🔌 API Specification

Implement mocks based on the OpenAPI 3.0 spec in `openapi.yml`.
All endpoints, schemas, and response codes must match the specification.

**Recommended tools:**
- Mock Service Worker (MSW)
- json-server with custom middleware
- fetch mocks for testing
- Any other mocking solution you prefer

**Requirements:**
- Valid PIN for testing: `123456`
- Anonymous codes: exactly 16 digits
- Email validation: standard email format
- Proper HTTP status codes (200/401/422)

> 💡 **Tip:** Open `openapi.yml` in [Swagger Editor](https://editor.swagger.io/) to view the interactive documentation

## 💰 Payment Structure

### $100 — Basic Implementation
- ✅ All 4 pages with routing
- ✅ Anonymous registration (`/reg/code`)
- ✅ Smart input on `/auth` (detects email vs. code)
- ✅ Email validation + code length validation
- ✅ Responsive layout (mobile ≥ 320px)

### $150 — Quality Implementation
All above requirements **plus:**
- ✅ Google OAuth mock implementation
- ✅ Persisted authentication (localStorage)
- ✅ 60-second countdown timer for PIN resend
- ✅ "Copy to clipboard" button (Clipboard API)
- ✅ Comprehensive TypeScript typing
- ✅ unit test coverage for key components
- ✅ Global error handling (toast/alert system)

## 🎯 Evaluation Criteria

1. **Business logic correctness** and API compliance
2. **Code quality** — architecture, separation of concerns
3. **TypeScript usage** — proper typing, minimal `any`
4. **Test coverage** — readable, meaningful tests
5. **UX details** — focus management, accessibility, responsiveness
6. **CI status** — all required checks must pass

## 💳 Payment Terms

- **Methods:** Cryptocurrency (USDC/USDT), PayPal
- **Timeline:** Payment within 24 hours after acceptance
- **Review period:** Up to 3 business days after submission
- **Bonus evaluation:** Discussed individually based on implementation quality

## 📞 Support

Questions? Contact us at **dev@syncstack.net**
*We respond during business hours (10:00-19:00 UTC+3)*

---

**Good luck and happy coding!** 🚀