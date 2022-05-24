const {
  createNewUser,
  findUserByEmail,
  updateUserDetails,
} = require("../../models/users/users.model");
const { createNewToken } = require("./auth.controller");
const bcrypt = require("bcrypt");
const User = require("../../models/users/users.mongo");
const EmailValidator = require("email-deep-validator");
const emailValidator = new EmailValidator({ timeout: 1000 });

async function httpGetAuthDetails(req, res) {
  const token = req.token;

  if (token == null) {
    res.status(200).json({ user: null });
  } else {
    let user = await User.findById(token.id);
    res.status(200).json({ user });
  }
}

async function httpCreateNewUser(req, res) {
  const user = req.body;
  try {
    if (user.password != user.confirmPassword) {
      return res.status(409).json({ error: "confirm password does not match" });
    }

    const userExists = await findUserByEmail(user.email);
    if (userExists != null) {
      return res.status(409).json({ error: "email already exist" });
    }

    const { validDomain, validMailbox } = await emailValidator.verify(
      user.email
    );
    if (validDomain == false || validMailbox == false) {
      return res.status(409).json({ error: "Invalid Email" });
    }

    const newUser = await createNewUser(user);
    // also create jwt token
    const token = createNewToken(newUser._id);
    res.cookie("jwt", token, { httpOnly: true });
    res.status(200).json({ user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

async function httpUpdateUser(req, res) {
  try {
    const updatedUser = updateUserDetails(req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function httpLoginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (user == null) {
      return res.status(401).json({ error: "email does not exist" });
    }
    if (user.password == null) {
      return res.status(401).json({ error: "you have logged in with google" });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect == false) {
      return res.status(401).json({ error: "password does not match" });
    }

    const token = createNewToken(user._id);
    res.cookie("jwt", token, { httpOnly: true });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function httpLoginGoogleUser(req, res) {
  const { email, error } = req.body;
  try {
    if (error) {
      return res.status(409).json(req.body);
    }
    let user = await findUserByEmail(email);
    if (user == null) {
      // meaning it is first time they are logging in
      user = await createNewUser({ email });
    }

    const token = createNewToken(user._id);
    res.cookie("jwt", token, { httpOnly: true });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

function httpLogoutUser(req, res) {
  let containsCookies = req.cookies.jwt;

  if (containsCookies) {
    res.clearCookie("jwt");
    res.status(204).end();
  } else {
    res.status(404).json({ error: "no user to logout" });
  }
}

module.exports = {
  httpCreateNewUser,
  httpLoginUser,
  httpLoginGoogleUser,
  httpLogoutUser,
  httpGetAuthDetails,
  httpUpdateUser,
};
