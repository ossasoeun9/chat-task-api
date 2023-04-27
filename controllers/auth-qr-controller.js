import LoginQRCode from "../models/login-qr-model.js";

const requestQRCode = async (req, res) => {
    try {
        const timestamp = Date.now();
        const code = await generateQRCode();

        // Create a new LoginQRCode document with the generated code
        const loginQRCode = new LoginQRCode({ code });
        await loginQRCode.save();

        // Return the ID of the newly created document
        res.json(loginQRCode);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function generateQRCode() {
    let code = "";
    let unique = false;
  
    // Generate a 6-digit random number
    while (!unique) {
      code = Math.floor(Math.random() * 900000) + 100000;
      const result = await LoginQRCode.findOne({ code });
      if (!result) {
        // The code is unique
        unique = true;
      }
    }
  
    return code;
  }

export {
    requestQRCode
}