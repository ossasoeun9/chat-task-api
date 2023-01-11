import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateOtpToken = (phone_number, country, otp_code, expiresIn) => {
  return jsonwebtoken.sign(
    { phone_number, country, otp_code },
    process.env.OTP_TOKEN_KEY,
    {
      expiresIn: expiresIn,
    }
  );
};

const generatePhoneChangeToken = (phone_number, country, otp_code, expiresIn) => {
  return jsonwebtoken.sign(
    { phone_number, country, otp_code },
    process.env.PHONE_CHANGE_TOKEN_KEY,
    {
      expiresIn: expiresIn,
    }
  );
};

const generateAccessToken = (user, expiresIn) => {
  return jsonwebtoken.sign({ user }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: expiresIn,
  });
};

const generateRefreshToken = (user, expiresIn) => {
  return jsonwebtoken.sign({ user }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: expiresIn,
  });
};

export { generateOtpToken, generatePhoneChangeToken, generateAccessToken, generateRefreshToken };
