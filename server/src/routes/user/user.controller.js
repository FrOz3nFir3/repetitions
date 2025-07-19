const {
  createNewUser,
  findUserByEmail,
  findUserByGoogleId,
  updateUserDetails,
  updateUser,
  getUserProgress,
  getUserById,
} = require("../../models/users/users.model");
const { getCardsByIds } = require("../../models/cards/cards.model");
const {
  setTokens,
  verifyRefreshToken,
  createAccessToken,
  ACCESS_TOKEN_MAX_AGE_MS,
} = require("./auth.controller");
const bcrypt = require("bcrypt");
const User = require("../../models/users/users.mongo");
const EmailValidator = require("email-deep-validator");
const emailValidator = new EmailValidator({ timeout: 1000 });

async function httpRefreshToken(req, res) {
  const refreshTokenFromCookie = req.signedCookies.jwt_refresh;

  if (!refreshTokenFromCookie) {
    return res.status(401).json({ error: "User not Logged in" });
  }

  const decoded = verifyRefreshToken(refreshTokenFromCookie);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid refresh token." });
  }

  const newAccessToken = createAccessToken(decoded.id);

  res.cookie("jwt_access", newAccessToken, {
    httpOnly: true,
    signed: true,
    maxAge: ACCESS_TOKEN_MAX_AGE_MS, // 1 hour
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api",
  });

  res.status(200).json({ ok: true });
}

async function httpGetAuthDetails(req, res) {
  const token = req.token; // From requireAuthentication middleware

  const user = await getUserById(token.id);
  if (!user) {
    return res.status(404).json({ user: null });
  }
  const { password, __v, _id, ...userDetails } = user._doc;
  res.status(200).json({ user: userDetails });
}

async function httpCreateNewUser(req, res) {
  const newUser = req.body;
  try {
    if (!newUser.name || typeof newUser.name !== "string") {
      return res.status(400).json({ error: "Name is required" });
    }
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
    setTokens(res, user);
    await user.save(); // Save the user with the new refresh token

    const { _id, password, __v, refreshToken, ...userDetails } = user._doc;
    res.status(200).json({ user: userDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

async function httpUpdateUser(req, res) {
  try {
    const { id } = req.token;
    const { name, email, googleId } = req.body;
    const updateFields = {};

    if (name?.trim() === "") {
      return res.status(400).json({ error: "Name cannot be empty" });
    }
    if (name) {
      updateFields.name = name.trim();
    }

    if (email?.trim() === "") {
      return res.status(400).json({ error: "Email cannot be empty" });
    }
    if (email) {
      const { validDomain, validMailbox } = await emailValidator.verify(email);
      if (!validDomain || !validMailbox) {
        return res.status(400).json({ error: "Invalid Email" });
      }
      const existingUser = await findUserByEmail(email.trim());
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(409).json({ error: "Email already in use" });
      }
      updateFields.email = email;
    }

    if (googleId) {
      const existingGoogleUser = await findUserByGoogleId(googleId);
      if (existingGoogleUser && existingGoogleUser._id.toString() !== id) {
        return res.status(409).json({
          error: "This Google account is already linked to another user.",
        });
      }
      updateFields.googleId = googleId;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "No valid fields to update." });
    }

    await updateUser(id, updateFields);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

async function httpUpdateUserProgress(req, res) {
  const { id } = req.token;

  try {
    await updateUserDetails(id, req.body);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
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

    setTokens(res, user);
    await user.save(); // Save the user with the new refresh token

    const { _id, password: p, __v, refreshToken, ...userDetails } = user._doc;
    return res.status(200).json({ user: userDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

async function httpLoginGoogleUser(req, res) {
  const { email, name, googleId } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ error: "Google login failed no email" });
    }

    let user = await findUserByGoogleId(googleId);
    if (user == null) {
      user = await createNewUser({ email, name, googleId });
    } else if (!user.googleId) {
      user = await updateUser(user._id, { googleId, name });
    }

    setTokens(res, user);
    await user.save();
    const { _id, password, __v, refreshToken, ...userDetails } = user._doc;
    return res.status(200).json({ user: userDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}

async function httpLogoutUser(req, res) {
  const refreshTokenFromCookie = req.signedCookies.jwt_refresh;
  if (!refreshTokenFromCookie) {
    return res.sendStatus(204); // No content
  }
  res.clearCookie("jwt_access", { path: "/api" });
  res.clearCookie("jwt_refresh", { path: "/api/user" });
  return res.status(200).json({ ok: true });
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
  httpUpdateUserProgress,
  httpRefreshToken,
};
