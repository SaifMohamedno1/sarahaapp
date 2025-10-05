# Authentication Middleware

Path: `Src/Middlewares/authentication.middleware.js`

Validates the `accesstoken` bearer token, checks blacklist, and attaches `req.loggedInUser`.

Expected request header
```
accesstoken: bearer <ACCESS_TOKEN>
```

Behavior
- Rejects if header missing or not `bearer` scheme
- Verifies JWT using `ACCESS_TOKEN_SECRET`
- Ensures token not blacklisted in `BlackListedTokens` by `jti`
- Loads user by `decoded.id`
- Sets `req.loggedInUser = { user: { _id }, token: { tokenId, expirationDate } }`

Errors
- 401: missing/invalid token, blacklisted
- 404: user not found
