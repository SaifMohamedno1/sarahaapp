# Overview

Sarahapp is an Express API for anonymous messaging with JWT-based auth and OTP email confirmation.

- Server entry: `Src/index.js`
- Routers:
  - `GET /` → 404 handler by default
  - `messages` → `Src/Modules/Users/Services/Message/message.controller.js`
  - `users` → `Src/Modules/Users/Services/User/user.controller.js`
- Database: MongoDB via Mongoose (`Src/db/Models/db.connection.js`)

## Environment Variables
Create a `.env` file with:

```
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
SALT_ROUNDS=10
MONGODB_URI=mongodb://localhost:27017/sarahapp
EMAIL_USER=...
EMAIL_PASS=...
```

Note: The codebase currently logs `ACCESS_TOKEN_SECRET` at startup and uses hardcoded Gmail credentials; replace with env variables for security.

## Run Locally
```bash
npm install
npm run dev
# server on http://localhost:3000
```
