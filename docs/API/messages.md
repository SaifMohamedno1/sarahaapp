# Messages API

Base path: `/messages`

## POST /messages/send/:receiverId
Send an anonymous message to a user.

Request
- Params: `receiverId` (ObjectId)
- Body:
```json
{
  "content": "string"
}
```

Responses
- 200 OK
```json
{
  "message": "Message sent successfully",
  "messageContent": "..."
}
```
- 404 Not Found
```json
{ "message": "User not found" }
```

Example (curl)
```bash
curl -X POST \
  http://localhost:3000/messages/send/66fef7f6e9b9c9e6c2e8a111 \
  -H 'Content-Type: application/json' \
  -d '{"content":"Hello there!"}'
```
