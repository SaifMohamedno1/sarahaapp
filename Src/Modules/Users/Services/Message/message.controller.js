import { Router } from "express";
import { sendMessagesService } from "./message.sevice.js";

const router = Router();
router.post("/send/:receiverId", sendMessagesService);

export default router;
