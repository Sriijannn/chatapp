const jwt = require("jsonwebtoken");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.sec, {
    expiresIn: "300d",
  });
};
module.exports = generateToken;
