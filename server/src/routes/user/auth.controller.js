const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "../.env" });
const JWT_SECRET = process.env.JWT_SECRET;

const TWO_DAYS = 172800000;

function createNewToken(id) {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: TWO_DAYS,
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

function sendCookie(res, data) {
  // also create jwt token
  const token = createNewToken(data);
  res.cookie("jwt", token, { httpOnly: true, signed: true, maxAge: TWO_DAYS });
}

module.exports = {
  createNewToken,
  getToken,
  sendCookie,
};
