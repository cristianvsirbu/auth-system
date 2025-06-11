# Auth System

A comprehensive authentication system built with React and TypeScript, providing multiple authentication methods in a responsive and user-friendly interface.

![Auth System](https://img.shields.io/badge/Auth%20System-1.0.0-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.9-38B2AC?logo=tailwindcss)

## Features

### Multiple Authentication Methods
- Email verification with 6-digit PIN
- Anonymous access with 16-digit code
- Google OAuth authentication (mock implementation)

### User Experience
- Smart input detection (email vs. access code)
- Form validation with informative error messages
- Responsive design (mobile-friendly from 320px)
- Toast notifications for operation feedback

### Security
- PIN code timeout (60-second countdown for resending)
- Protected routes
- Persisted authentication using `localStorage`

### Developer Experience
- Comprehensive TypeScript typing
- API mocking for development
- CI/CD pipeline with GitLab
- Code quality tools and testing

## Tech Stack
- **Frontend**: React 19, TypeScript, React Router 7
- **Styling**: Tailwind CSS 4
- **Build Tool**: Vite 6
- **Testing**: Vitest, Playwright
- **API Mocking**: MSW (Mock Service Worker)
- **Code Quality**: Biome

## Usage

The application provides the following authentication flows:

### Email Authentication
1. Enter your email on the login page.
2. Receive a 6-digit PIN code.
3. Enter the PIN to authenticate.

### Anonymous Registration
1. Generate a 16-digit access code.
2. Save or copy this code for future logins.
3. Use the code to log in later.

### Google Authentication
1. Click "Continue with Google."
2. Follow the authentication flow.
