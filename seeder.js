import connectDB from "./configs/db-config.js";
import countryList from "./asset-data/country-code.js";
import Country from "./models/country-model.js";

connectDB();

const storePhones = async () => {
  try {
    await Country.deleteMany();
    await Country.insertMany(countryList);
    console.log(`Success`);
  } catch (error) {
    console.log(error);
  }
};

storePhones();
