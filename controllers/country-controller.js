import Country from "../models/country-model.js";

const fetchPhoneCode = async (req, res) => {
  try {
    const phoneCodes = await Country.find();
    res.json(phoneCodes);
  } catch (error) {
    res.send({
      message: error,
    });
  }
};

export default fetchPhoneCode;
