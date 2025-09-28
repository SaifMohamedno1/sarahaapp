import User from "../../../../db/Models/user.model.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../../../../Utils/send.email.js"; 
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { customAlphabet } from "nanoid";
import { eventEmitter as emmiter } from "../../../../Utils/send.email.js";


const uniquestring=customAlphabet('sioaiosd221Xkk',5)


const createTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};
export const RefreshTokenService = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign(
          { id: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        return res.json({ accessToken });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
export const SignUpService = async (req, res) => {
  try {
    const { name, email, password, age, phone, gender } = req.body;

    const isEmailExist = await User.findOne({
      $or: [{ email }, { name }],
    });

    if (isEmailExist) {
      return res.status(409).json({ message: "User already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = uniquestring()
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      phone,
      gender,
      otps:{confirmation:hashSync(otp,10)}
    });

   
      emmiter.emit("sendEmail",{
      to: email,
      subject: "confirmation email",
      content: `
        Your OTP Confirmation is ${otp}
      `,
    });

    return res
      .status(201)
      .json({ message: "User created successfully", user });
  } catch (error) {
    console.log("error in signup service", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
export const confirmEmailService = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, isconfirmed: false });

    if (!user) {
        return res.status(400).json({ message: "user not found or already confirmed" });
    }

    if (user.otps.confirmationExpiration < Date.now()) {
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const isOtpMatched = compareSync(otp, user.otps?.confirmation);

    if (!isOtpMatched) {
        return res.status(400).json({ message: "invalid otp" });
    }

    user.isconfirmed = true;
    user.otps.confirmation = null;
    user.otps.confirmationExpiration = null;
    await user.save();

    res.status(200).json({ message: "Confirmed" });
};
export const requestResetPasswordService = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

  
    const otp = uniquestring(); 


    user.resetPasswordOtp = await bcrypt.hash(otp, 10);
    user.resetPasswordOtpExpiration = Date.now() + 10 * 60 * 1000; 
    await user.save();

    await sendEmail({
      to: email,
      subject: "Password Reset Request",
      content: `Your OTP for password reset is: ${otp}`,
    });

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error in requestResetPasswordService:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const resetPasswordService = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiration) {
      return res.status(400).json({ message: "No reset request found" });
    }

    if (user.resetPasswordOtpExpiration < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isOtpValid = bcrypt.compareSync(otp, user.resetPasswordOtp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiration = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in resetPasswordService:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const SignInService = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = createTokens(user);  
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({ 
      message: "User signed in successfully", 
      accessToken, 
      refreshToken, 
      user 
    });

  } catch (error) {
    console.error("Error in SignInService:", error.message, error.stack);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
}

};

export const UpdateAccountService = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, age, gender } = req.body; 

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, age, gender },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Account updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const DeleteAccountService = async (req, res) => {
  try {
    const { userId } = req.params; 
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
export const updatePasswordService = async(req, res)=>{
 
    const {user:{_id}} = req.loggedInUser

    const {oldPassword, newPassword} = req.body;

    // Is password and newPassword are provided
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "password and newPassword are required" });
    }

    // Is user exists
    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ message: "User noOoot found" });

    // Is oldPassword is correct
    const isMatch = compareSync(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Is newPassword is same as oldPassword
    const isSameAsOld = compareSync(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({ message: "New password must be different from old password" });
    }

    // Okay update password with hashed value
    user.password = hashSync(newPassword, Number(process.env.SALT_ROUNDS));
    await user.save();

    return res.status(200).json({message:"Password updated successfully",user})
}