# Data Models

## User (`Src/db/Models/user.model.js`)

Fields
- **name**: String, required
- **email**: String, required, unique
- **password**: String, required
- **phone**: String, required
- **age**: Number, required, 19-60
- **refreshToken**: String|null
- **otps.confirmation**: String (hashed)
- **otps.resetpassword**: String (optional)
- **isconfirmed**: Boolean, default false
- **resetPasswordOtp**: String (hashed)
- **resetPasswordOtpExpiration**: Date

## Messages (`Src/db/Models/messages.model.js`)

Fields
- **content**: String, required
- **receiverId**: ObjectId → `User`
- timestamps enabled

## BlackListedTokens (`Src/db/Models/black-listed-tokens.model.db.js`)

Fields
- **tokenId**: String, required, unique (JWT jti)
- **expirationDate**: Date, required
