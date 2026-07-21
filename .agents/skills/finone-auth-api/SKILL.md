---
name: finone-auth-api
description: Remember the authentication configuration, route protection setup, and Spring Boot backend API contract (POST /assets and POST /debts) for the FinOne Next.js client.
---

# FinOne Client Integration Summary

This skill captures the authentication rules, route guards, and backend REST contracts implemented for the `finone-client` project.

## 1. Authentication Integration
- **Firebase SDK Configuration:** Initialized inside [firebase.ts](file:///Users/anand-13674/AMBrain/FinOne/finone-client/src/lib/firebase.ts). Reads properties dynamically from `.env.local`.
- **Protected Dashboard Route:** Guarded reactively in [page.tsx](file:///Users/anand-13674/AMBrain/FinOne/finone-client/src/app/dashboard/page.tsx):
  - Listens to `onAuthStateChanged`. Redirects unauthorized access to `/login`.
  - Profile menu details (Avatar first letter, Full Name, Email) are bound to `auth.currentUser`.
  - Dropdown **Log out** button calls `signOut(auth)` before redirecting.
- **Settings View Syncing:** [settings-view.tsx](file:///Users/anand-13674/AMBrain/FinOne/finone-client/src/app/dashboard/settings-view.tsx) pre-populates name and email with authenticated user information, and binds security logouts to Firebase `signOut(auth)`.

## 2. API Connectivity (Spring Boot Integration)
- **Base Request Client:** Managed in [api.ts](file:///Users/anand-13674/AMBrain/FinOne/finone-client/src/lib/api.ts). Attaches the Firebase JWT Bearer token automatically via a request interceptor:
  `Authorization: Bearer <idToken>`
- **Asset/Liability Registration:** [wealth-add-drawer.tsx](file:///Users/anand-13674/AMBrain/FinOne/finone-client/src/app/dashboard/wealth-add-drawer.tsx) compiles inputs and submits asynchronous POST requests:
  - **Assets:** `POST /assets`
  - **Debts:** `POST /debts`
  - Displays interactive loading states (`submitting`) and handles failures gracefully.
