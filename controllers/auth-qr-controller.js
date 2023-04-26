import LoginQRCode from "../models/login-qr-model.js";

const requestQRCode = async (req, res) => {
    try {
        const timestamp = Date.now();
        const code = `chattask_${timestamp}`;

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

export {
    requestQRCode
}