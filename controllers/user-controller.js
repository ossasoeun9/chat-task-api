import User from "../models/user-model.js";

const createUser = async (req, res) => {
  const messages = [];
  if (!req.body.phone_number) {
    messages.push({
      phone_number: "Phone Number field is required",
    });
  }

  if (!req.body.country) {
    messages.push({
      country: "Country field is required",
    });
  }

  if (messages.length) {
    return res.status(422).json({
      message: messages,
    });
  }

  try {
    const user = await User.create({
      phone_number: req.body.phone_number,
      // username: req.body.username,
      country: req.body.country,
    });
    res.json(user);
  } catch (error) {
    res.json({
      message: error,
    });
  }
};

const getProfile = async (req, res) => {
  res.send("Get Profile");
};

const editName = async (req, res) => {
  res.send("Edit Name");
};

const editBio = async (req, res) => {
  res.send("Edit Bio");
};

const setProfilePicture = async (req, res) => {
  res.send("Set Profile Picture");
};

const removeProfilePicure = async (req, res) => {
  res.send("Remove Profile Pitcure");
};

const changeUsername = async (req, res) => {
  res.send("Change Username");
};

const changePhoneNumber = async (req, res) => {
  res.send("Change Phone Number");
};

export {
  createUser,
  getProfile,
  editName,
  editBio,
  setProfilePicture,
  removeProfilePicure,
  changePhoneNumber,
  changeUsername,
};
