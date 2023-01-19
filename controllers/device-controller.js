import DeviceLogin from "../models/device-login-model.js"

const getDeviceLogin = async (req, res) => {
  const { _id } = req.user
  try {
    const devices = await DeviceLogin.find({ user: _id })
    return res.json(devices)
  } catch (error) {
    return res.status(500).json({
      message: error
    })
  }
}

export { getDeviceLogin }
