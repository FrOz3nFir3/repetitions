import {
  createNewUser,
  findUserByEmail,
  findUserByGoogleId,
  updateUserQuizProgress,
  updateUser,
  getDetailedReport,
  getUserReviewProgress,
  getUserStats,
  getUserQuizProgress,
  getUserById,
  updateUserReviewProgress,
  findUserByUsername,
  findUserByEmailOrUsername,
  generateUniqueUsername,
  getPublicUserByUsername,
  getUserStudyingCount,
  getUserLastReviewedByCardProgress,
} from "../../models/users/users.model.js";
import { getPagination } from "../../services/query.js";
import {
  setTokens,
  verifyRefreshToken,
  createAccessToken,
  createCSRFToken,
  ACCESS_TOKEN_MAX_AGE_MS,
} from "./auth.controller.js";
import { compare } from "bcrypt";
import EmailValidator from "email-deep-validator";
const emailValidator = new EmailValidator({ timeout: 10000 });
import { userDetailsProjection } from "../../utils/constants.js";

const isProduction = process.env.NODE_ENV === "production";

export async function httpGetPublicUserByUsername(req, res) {
  const { username } = req.params;
  try {
    const user = await getPublicUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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
  const csrfToken = createCSRFToken();

  res.cookie("jwt_access", newAccessToken, {
    httpOnly: true,
    signed: true,
    maxAge: ACCESS_TOKEN_MAX_AGE_MS, // 1 hour
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api",
  });

  // Set new CSRF token as session cookie
  res.cookie("csrf_token", csrfToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api",
  });

  res.status(200).json({
    message: "Token refreshed successfully",
    csrfToken, // For Redux store update
  });
}

export async function httpGetCSRFToken(req, res) {
  const csrfToken = createCSRFToken();

  res.cookie("csrf_token", csrfToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api",
  });

  res.status(200).json({
    csrfToken,
  });
}

export async function httpPostAuthDetails(req, res) {
  const token = req.token; // From requireAuthentication middleware

  const user = await getUserById(token.id, userDetailsProjection);
  if (!user) {
    return res.status(404).json({ user: null });
  }

  // Generate fresh CSRF token for authenticated user
  const csrfToken = createCSRFToken();

  // TODO: make samesite back to lax after domain is same
  // Update CSRF session cookie
  res.cookie("csrf_token", csrfToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api",
  });

  res.status(200).json({
    user,
    csrfToken,
  });
}

export async function httpCreateNewUser(req, res) {
  const newUser = req.body;
  try {
    // --- Username Validation ---
    if (!newUser.username || typeof newUser.username !== "string") {
      return res.status(400).json({ error: "Username is required" });
    }
    const username = newUser.username.trim();
    if (username.length < 3) {
      return res
        .status(400)
        .json({ error: "Username must be at least 3 characters" });
    }
    if (username.length > 30) {
      return res
        .status(400)
        .json({ error: "Username must be 30 characters or less" });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({
        error: "Username can only contain letters, numbers, and underscores",
      });
    }
    const usernameExists = await findUserByUsername(username);
    if (usernameExists) {
      return res.status(409).json({ error: "Username is already taken" });
    }
    newUser.username = username; // Use the sanitized username

    // --- Name Validation ---
    if (!newUser.name || typeof newUser.name !== "string") {
      return res.status(400).json({ error: "Name is required" });
    }

    // --- Password Validation ---
    if (newUser.password != newUser.confirmPassword) {
      return res.status(409).json({ error: "Confirm Password does not match" });
    }
    const userPassword = newUser.password;
    if (userPassword.length < 10) {
      return res
        .status(400)
        .json({ error: "Password must be at least 10 characters long" });
    }
    if (!/[A-Z]/.test(userPassword)) {
      return res
        .status(400)
        .json({ error: "Password must contain at least one uppercase letter" });
    }
    if (!/[a-z]/.test(userPassword)) {
      return res
        .status(400)
        .json({ error: "Password must contain at least one lowercase letter" });
    }
    if (!/[0-9]/.test(userPassword)) {
      return res
        .status(400)
        .json({ error: "Password must contain at least one number" });
    }
    if (!/[!@#$%^&*]/.test(userPassword)) {
      return res.status(400).json({
        error:
          "Password must contain at least one special character (!@#$%^&*)",
      });
    }

    // --- Email Validation ---
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
    const csrfToken = setTokens(res, user);
    const { _id, password, __v, studying, ...userDetails } = user._doc ?? user;
    res.status(200).json({
      user: userDetails,
      csrfToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

export async function httpUpdateUser(req, res) {
  try {
    const { id } = req.token;
    const { name, email, username, googleId } = req.body;
    const updateFields = {};

    if (name?.trim() === "") {
      return res.status(400).json({ error: "Name cannot be empty" });
    }
    if (name) {
      updateFields.name = name.trim();
    }

    if (username) {
      const sanitizedUsername = username.trim();
      if (sanitizedUsername.length < 3 || sanitizedUsername.length > 30) {
        return res
          .status(400)
          .json({ error: "Username must be between 3 and 30 characters" });
      }
      if (!/^[a-zA-Z0-9_]+$/.test(sanitizedUsername)) {
        return res.status(400).json({
          error: "Username can only contain letters, numbers, and underscores",
        });
      }
      const existingUser = await findUserByUsername(sanitizedUsername, {
        _id: 1,
      });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(409).json({ error: "Username already in use" });
      }
      updateFields.username = sanitizedUsername;
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

export async function httpUpdateUserQuizProgress(req, res) {
  const { id } = req.token;

  try {
    await updateUserQuizProgress(id, req.body);
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
  const { loginIdentifier, password } = req.body;
  try {
    const user = await findUserByEmailOrUsername(loginIdentifier, {
      __v: 0,
      "studying.quizAttempts": 0,
    });

    if (user == null) {
      return res
        .status(401)
        .json({ error: "User with that email or username does not exist" });
    }
    if (user.password == null) {
      return res.status(401).json({ error: "you have logged in with google" });
    }

    const isCorrect = await compare(password, user.password);
    if (isCorrect == false) {
      return res.status(401).json({ error: "password does not match" });
    }

    const csrfToken = setTokens(res, user);

    const { _id, password: p, studying, ...userDetails } = user;
    return res.status(200).json({
      user: userDetails,
      csrfToken,
    });
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
    userProjectionCopy._id = 1;
    let user = await findUserByGoogleId(googleId, userProjectionCopy);

    if (user == null) {
      // New Google user, check if email is already taken by a regular user
      const emailUser = await findUserByEmail(email);
      if (emailUser) {
        // Email exists, link Google ID to it
        user = await updateUser(emailUser._id, { googleId, name });
      } else {
        // Truly a new user
        const username = await generateUniqueUsername(email);
        user = await createNewUser({ email, name, googleId, username });
      }
    } else if (!user.googleId) {
      // This case is less likely with the above check but good for safety
      user = await updateUser(user._id, { googleId, name });
    }

    const csrfToken = setTokens(res, user);
    const { _id, ...userDetails } = user._doc ?? user;
    return res.status(200).json({
      user: userDetails,
      csrfToken,
    });
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
  let extraOptions = {};
  if (isProduction) {
    extraOptions = {
      secure: true,
      sameSite: "none",
    };
  }

  res.clearCookie("jwt_access", {
    path: "/api",
    ...extraOptions,
  });
  res.clearCookie("jwt_refresh", {
    path: "/api/user",
    ...extraOptions,
  });
  res.clearCookie("csrf_token", {
    path: "/api",
    ...extraOptions,
  });
  return res.status(200).json({ ok: true });
}

export async function httpGetUserProgressPaginated(req, res) {
  const { id: userId } = req.token;
  const { skip, limit } = getPagination(req.query);
  const { search } = req.query;

  try {
    const { cards, total } = await getUserReviewProgress(userId, {
      skip,
      limit,
      search,
    });

    const hasMore = skip + limit < total;
    const page = Math.floor(skip / limit) + 1;

    return res.json({
      cards,
      total,
      hasMore,
      page,
      limit,
    });
  } catch (error) {
    console.log(error, "error in paginated progress");
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
    const cardProgress = await getUserLastReviewedByCardProgress({
      userId,
      cardId: card_id,
    });
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

export async function httpGetUserStats(req, res) {
  const { id: userId } = req.token;

  try {
    const stats = await getUserStats(userId);
    return res.json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

export async function httpGetQuizProgress(req, res) {
  const { id: userId } = req.token;
  const { skip, limit } = getPagination(req.query);
  const { search } = req.query;

  try {
    const { cards, total } = await getUserQuizProgress(userId, {
      skip,
      limit,
      search,
    });
    const hasMore = skip + limit < total;
    const page = Math.floor(skip / limit) + 1;

    return res.json({
      cards,
      total,
      hasMore,
      page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}

export async function httpGetDetailedReport(req, res) {
  const { card_id } = req.params;
  const { id: userId } = req.token;

  try {
    const attempts = await getDetailedReport(userId, card_id);
    res.status(200).json(attempts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
