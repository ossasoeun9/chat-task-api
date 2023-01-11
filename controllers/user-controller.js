import User from "../models/user-model.js";

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
  getProfile,
  editName,
  editBio,
  setProfilePicture,
  removeProfilePicure,
  changePhoneNumber,
  changeUsername,
};
