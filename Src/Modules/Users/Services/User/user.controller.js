import express from "express";
import { 
  SignUpService, 
  SignInService, 
  UpdateAccountService,
  RefreshTokenService, 
  confirmEmailService,
  DeleteAccountService ,
  updatePasswordService, 
  requestResetPasswordService,
  resetPasswordService,

} from "./user.service.js";
import authenticationMiddleware from "../../../../Middlewares/authentication.middleware.js";

const router = express.Router();
router.put("/updatePassword/:userId", authenticationMiddleware, updatePasswordService);
router.post("/register", SignUpService);
router.post("/signin", SignInService);
router.post("/refresh", RefreshTokenService); 
router.put("/update/:userId", UpdateAccountService);
router.put("/confirm",confirmEmailService);
router.post("/requestResetPassword",requestResetPasswordService);
router.post("/resetPassword",resetPasswordService);
router.delete("/delete/:userId", DeleteAccountService);

export default router;
