const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "../.env" });
const JWT_SECRET = process.env.JWT_SECRET;

function createNewToken(id) {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "5h",
  });
}

function getToken(token = "") {
  try {
    let decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports = {
  createNewToken,
  getToken,
};
