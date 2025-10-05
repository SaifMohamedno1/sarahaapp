# Users API

Base path: `/users`

## POST /users/register
Register a new user and send OTP for email confirmation.

Request body
```json
{
  "name": "string",
  "email": "user@example.com",
  "password": "string",
  "age": 25,
  "phone": "+1000000000",
  "gender": "male"
}
```

Responses
- 201 Created
```json
{ "message": "User created successfully", "user": { /* user fields */ } }
```
- 409 Conflict: user already exists
- 500 Internal Server Error

Example
```bash
curl -X POST http://localhost:3000/users/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alice","email":"alice@example.com","password":"P@ssw0rd!","age":25,"phone":"+1234567890","gender":"female"}'
```

---

## PUT /users/confirm
Confirm email with OTP sent to the user's email.

Request body
```json
{ "email": "user@example.com", "otp": "ABCDE" }
```

Responses
- 200 OK: `{ "message": "Confirmed" }`
- 400 Bad Request: user not found/already confirmed, invalid or expired OTP

Example
```bash
curl -X PUT http://localhost:3000/users/confirm \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","otp":"ABCDE"}'
```

---

## POST /users/signin
Sign in with email and password; returns access and refresh tokens.

Request body
```json
{ "email": "user@example.com", "password": "string" }
```

Responses
- 200 OK
```json
{
  "message": "User signed in successfully",
  "accessToken": "...",
  "refreshToken": "...",
  "user": { /* user fields */ }
}
```
- 404 Not Found: invalid email or password

Example
```bash
curl -X POST http://localhost:3000/users/signin \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"P@ssw0rd!"}'
```

---

## POST /users/refresh
Exchange a valid refresh token for a new access token.

Request body
```json
{ "refreshToken": "..." }
```

Responses
- 200 OK: `{ "accessToken": "..." }`
- 401/403: refresh token required/invalid

Example
```bash
curl -X POST http://localhost:3000/users/refresh \
  -H 'Content-Type: application/json' \
  -d '{"refreshToken":"<refresh>"}'
```

---

## PUT /users/update/:userId
Update account details.

Request body
```json
{ "name": "string", "email": "user@example.com", "age": 30, "gender": "male" }
```

Responses
- 200 OK: `{ "message": "Account updated successfully", "user": { ... } }`
- 404 Not Found: user not found

Example
```bash
curl -X PUT http://localhost:3000/users/update/66fef7f6e9b9c9e6c2e8a111 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alice Updated","email":"alice@example.com","age":26,"gender":"female"}'
```

---

## DELETE /users/delete/:userId
Delete user by id.

Responses
- 200 OK: `{ "message": "User deleted successfully", "deletedUser": { ... } }`
- 404 Not Found

Example
```bash
curl -X DELETE http://localhost:3000/users/delete/66fef7f6e9b9c9e6c2e8a111
```

---

## PUT /users/updatePassword/:userId
Update password for the authenticated user.

Auth
- Requires header `accesstoken: bearer <accessToken>`

Request body
```json
{ "oldPassword": "string", "newPassword": "string" }
```

Responses
- 200 OK: `{ "message": "Password updated successfully", "user": { ... } }`
- 400 Bad Request: missing fields, incorrect old password, same as old
- 404 Not Found
- 401 Unauthorized: invalid/blacklisted token

Example
```bash
curl -X PUT http://localhost:3000/users/updatePassword/66fef7f6e9b9c9e6c2e8a111 \
  -H 'Content-Type: application/json' \
  -H 'accesstoken: bearer <ACCESS_TOKEN>' \
  -d '{"oldPassword":"old","newPassword":"newStrongP@ss"}'
```

---

## POST /users/requestResetPassword
Request an OTP to reset password.

Request body
```json
{ "email": "user@example.com" }
```

Responses
- 200 OK: `{ "message": "OTP sent to email" }`
- 404 Not Found: user not found

---

## POST /users/resetPassword
Reset password using the OTP.

Request body
```json
{ "email": "user@example.com", "otp": "ABCDE", "newPassword": "string" }
```

Responses
- 200 OK: `{ "message": "Password reset successful" }`
- 400 Bad Request: no request found/invalid or expired OTP
- 404 Not Found
