import otpGenerator from "otp-generator";
import User from "../models/user-model.js";

const requestOTP = async (req, res) => {

  if (req.body.phone_number === undefined) {
    return res.status(403).json({
        message: "Phone Number is required",
    })
  }

  const user = await User.findOne({phone_number: req.body.phone_number})

  const otpCode = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  if (user) {
    // const user2 = await User.updateOne({phone_number: req.body.phone_number}, {otp_code: otpCode})
  } else {
    
  }

  console.log(`Your verification code is ${otpCode}`)
  return res.json({
    message: "Message was sent to user",
  })
};

export { requestOTP };
