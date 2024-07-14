const mongoose = require("mongoose");
const connectdb = async () => {
  try {
    const connection = await mongoose.connect(process.env.db_url);
    console.log("Database connection established.");
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

module.exports = connectdb;
