import {
  createNewUser,
  findUserByEmail,
  findUserByGoogleId,
  updateUserDetails,
  updateUser,
  getUserProgress,
  getUserById,
  updateUserReviewProgress,
} from "../../models/users/users.model.js";
import { getCardsByIds } from "../../models/cards/cards.model.js";
import {
  setTokens,
  verifyRefreshToken,
  createAccessToken,
  ACCESS_TOKEN_MAX_AGE_MS,
} from "./auth.controller.js";
import { compare } from "bcrypt";
import EmailValidator from "email-deep-validator";
const emailValidator = new EmailValidator({ timeout: 10000 });
import { userDetailsProjection } from "../../utils/constants.js";

export async function httpRefreshToken(req, res) {
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

export async function httpPostAuthDetails(req, res) {
  const token = req.token; // From requireAuthentication middleware

  const user = await getUserById(token.id, userDetailsProjection);
  if (!user) {
    return res.status(404).json({ user: null });
  }
  res.status(200).json({ user });
}

export async function httpCreateNewUser(req, res) {
  const newUser = req.body;
  try {
    if (!newUser.name || typeof newUser.name !== "string") {
      return res.status(400).json({ error: "Name is required" });
    }
    if (newUser.password != newUser.confirmPassword) {
      return res.status(409).json({ error: "Confirm Password does not match" });
    }
    if (newUser.password.length < 5) {
      return res
        .status(409)
        .json({ error: "Password should be minimum 5 characters" });
    }

    const userExists = await findUserByEmail(
      newUser.email,
      userDetailsProjection
    );
    if (userExists != null) {
      return res.status(409).json({ error: "Email already exist" });
    }

    const { validDomain, validMailbox } = await emailValidator.verify(
      newUser.email
    );
    if (validDomain == false || validMailbox == false) {
      if (!validDomain) {
        return res.status(409).json({ error: "Invalid Email Domain" });
      }
      if (!validMailbox) {
        return res
          .status(409)
          .json({ error: "Invalid Email it cannot take mails" });
      }
      return res
        .status(409)
        .json({ error: "Invalid Email please try with different email" });
    }

    const user = await createNewUser(newUser);
    setTokens(res, user);
    const { _id, password, __v, ...userDetails } = user._doc;
    res.status(200).json({ user: userDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

export async function httpUpdateUser(req, res) {
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
      if (validDomain == false || validMailbox == false) {
        return res.status(409).json({ error: "Invalid Email" });
      }

      const existingUser = await findUserByEmail(email.trim(), { _id: 1 });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(409).json({ error: "Email already in use" });
      }
      updateFields.email = email.trim();
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

export async function httpUpdateUserProgress(req, res) {
  const { id } = req.token;

  try {
    await updateUserDetails(id, req.body);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

export async function httpUpdateUserReviewProgress(req, res) {
  const { id } = req.token;
  const { card_id, lastReviewedCardNo } = req.body;

  if (!card_id || lastReviewedCardNo === undefined) {
    return res
      .status(400)
      .json({ error: "card_id and lastReviewedCardNo are required." });
  }

  try {
    await updateUserReviewProgress(id, card_id, lastReviewedCardNo);
    res.status(200).json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

export async function httpLoginUser(req, res) {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email, {
      __v: 0,
      "studying.quizAttempts": 0,
    });
    if (user == null) {
      return res.status(401).json({ error: "email does not exist" });
    }
    if (user.password == null) {
      return res.status(401).json({ error: "you have logged in with google" });
    }

    const isCorrect = await compare(password, user.password);
    if (isCorrect == false) {
      return res.status(401).json({ error: "password does not match" });
    }

    setTokens(res, user);

    const { _id, password: p, ...userDetails } = user._doc;
    return res.status(200).json({ user: userDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function httpLoginGoogleUser(req, res) {
  const { email, name, googleId } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ error: "Google login failed no email" });
    }

    const userProjectionCopy = { ...userDetailsProjection };
    delete userProjectionCopy._id;
    let user = await findUserByGoogleId(googleId, userProjectionCopy);
    if (user == null) {
      user = await createNewUser({ email, name, googleId });
    } else if (!user.googleId) {
      user = await updateUser(user._id, { googleId, name });
    }

    setTokens(res, user);
    const { _id, ...userDetails } = user._doc;
    return res.status(200).json({ user: userDetails });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
}

export async function httpLogoutUser(req, res) {
  const refreshTokenFromCookie = req.signedCookies.jwt_refresh;
  if (!refreshTokenFromCookie) {
    return res.sendStatus(204); // No content
  }
  res.clearCookie("jwt_access", { path: "/api" });
  res.clearCookie("jwt_refresh", { path: "/api/user" });
  return res.status(200).json({ ok: true });
}

export async function httpGetUserProgress(req, res) {
  const { id: userId } = req.token;

  try {
    const user = await getUserProgress(userId);
    const userStudying =
      user?.[0]?.studying?.map((s) => ({
        cardId: s.card_id,
        lastReviewedCardNo: s.lastReviewedCardNo,
      })) ?? [];
    if (!userStudying || userStudying.length === 0) {
      return res.status(200).json([]);
    }

    const cards = await getCardsByIds(userStudying.map((s) => s.cardId));

    // map back
    const cardsWithProgress = userStudying.map((s) => {
      const card = cards.find((c) => c._id.toString() === s.cardId.toString());
      return {
        ...(card?._doc ?? {}),
        lastReviewedCardNo: s.lastReviewedCardNo,
      };
    });

    return res.json(cardsWithProgress);
  } catch (error) {
    console.log(error, "erro");
    res.status(500).json({ error });
  }
}

export async function httpGetCardReviewProgress(req, res) {
  const { card_id } = req.params;
  const { id: userId } = req.token;

  if (!card_id) {
    return res.status(400).json({ error: "card_id is required" });
  }

  try {
    const user = await getUserProgress(userId);
    const cardProgress = user?.[0]?.studying?.find(
      (s) => s.card_id && s.card_id.toString() === card_id
    );

    if (!cardProgress) {
      return res.status(200).json({ lastReviewedCardNo: 0 });
    }

    return res.status(200).json({
      lastReviewedCardNo: cardProgress.lastReviewedCardNo || 0,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

export async function httpGetDetailedReport(req, res) {
  const { card_id } = req.params;
  const { id: userId } = req.token;

  try {
    const user = await getUserById(userId, { studying: 1 });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cardProgress = user.studying.find(
      (s) => s && s.card_id && s.card_id.toString() === card_id
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
