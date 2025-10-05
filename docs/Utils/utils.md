# Utilities

## `Src/Utils/token.utilis.js`
- **generateToken(payload, secret, options)** → string
- **verifyToken(token, secret)** → decoded payload

### Example
```js
import { generateToken, verifyToken } from "../../Src/Utils/token.utilis.js";

const access = generateToken({ id: "<userId>" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
const decoded = verifyToken(access, process.env.ACCESS_TOKEN_SECRET);
```

## `Src/Utils/encryption.js`
- **encrypt(text: string)** → string `ivHex:cipherHex`

### Example
```js
import { encrypt } from "../../Src/Utils/encryption.js";

const secret = encrypt("hello world");
console.log(secret);
```

## `Src/Utils/send.email.js`
- **sendEmail({ to, cc?, subject, content, attachments? })** → Promise<info>
- **eventEmitter**: Node `EventEmitter` for email events

### Example
```js
import { sendEmail, eventEmitter } from "../../Src/Utils/send.email.js";

await sendEmail({
  to: "user@example.com",
  subject: "Welcome",
  content: "<b>Hello!</b>"
});

eventEmitter.emit("sendEmail", { to: "user@example.com", subject: "test", content: "Hi" });
```
