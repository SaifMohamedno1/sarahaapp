import mongoose from "mongoose";

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: [19, '+18'],
    max: [60, 'the age must be less than 60 ']
  },
  refreshToken: { 
    type: String,
    default: null
  },
  otps:{
    confirmation: String,
    resetpassword: String
  },
  isconfirmed:{
    type:Boolean,
    default:false
  }, 
  resetPasswordOtp: { type: String },
  resetPasswordOtpExpiration: { type: Date },


});

const user = mongoose.model("user", userschema);
export default user;
