const {
  createNewUser,
  findUserByEmail,
  updateUserDetails,
  getUserProgress,
  getUserById,
} = require("../../models/users/users.model");
const { getCardsByIds } = require("../../models/cards/cards.model");
const { sendCookie } = require("./auth.controller");
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
  const newUser = req.body;
  try {
    if (newUser.password != newUser.confirmPassword) {
      return res.status(409).json({ error: "confirm password does not match" });
    }
    if (newUser.password.length < 5) {
      return res
        .status(409)
        .json({ error: "Password should be minimum 5 characters" });
    }

    const userExists = await findUserByEmail(newUser.email);
    if (userExists != null) {
      return res.status(409).json({ error: "email already exist" });
    }

    const { validDomain, validMailbox } = await emailValidator.verify(
      newUser.email
    );
    if (validDomain == false || validMailbox == false) {
      return res.status(409).json({ error: "Invalid Email" });
    }

    const user = await createNewUser(newUser);
    sendCookie(res, user._id);

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

async function httpUpdateUser(req, res) {
  try {
    const updatedUser = updateUserDetails(req.body);
    res.status(200).json({ ok: true });
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

    sendCookie(res, user._id);

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

    sendCookie(res, user._id);

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}

function httpLogoutUser(req, res) {
  let containsCookies = req.signedCookies.jwt;

  if (containsCookies) {
    res.clearCookie("jwt");
    res.status(204).end();
  } else {
    res.status(404).json({ error: "no user to logout" });
  }
}

async function httpGetUserProgress(req, res) {
  const { id: userId } = req.token;

  try {
    const user = await getUserProgress(userId);
    const cardsIds = user?.[0]?.studying?.map((s) => s.card_id) ?? [];
    if (!cardsIds || cardsIds.length === 0) {
      return res.status(200).json([]);
    }

    const cards = await getCardsByIds(cardsIds);
    return res.json(cards);
  } catch (error) {
    console.log(error, "erro");
    res.status(500).json({ error });
  }
}

async function httpGetDetailedReport(req, res) {
  const { card_id } = req.params;
  const { id: userId } = req.token;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cardProgress = user.studying.find(
      (s) => s.card_id && s.card_id.toString() === card_id
    );

    if (!cardProgress) {
      return res
        .status(404)
        .json({ error: "Card progress not found for this user." });
    }

    res.status(200).json(cardProgress.quizAttempts || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  httpCreateNewUser,
  httpLoginUser,
  httpLoginGoogleUser,
  httpLogoutUser,
  httpGetAuthDetails,
  httpUpdateUser,
  httpGetUserProgress,
  httpGetDetailedReport,
};
