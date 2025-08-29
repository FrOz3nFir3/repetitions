// cookie approach doesn't work cross domain
// export function isSessionPotentiallyActive() {
//   return document.cookie.includes("session-status=active");
// }

// export function clearSessionStatusCookie() {
//   // To "clear" a cookie, we set its expiration date to a time in the past.
//   // The path must match the one used to set the cookie.
//   document.cookie =
//     "session-status=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
// }

const SESSION_STATUS_KEY = "sessionStatus";

export function isSessionPotentiallyActive() {
  try {
    return window.localStorage.getItem(SESSION_STATUS_KEY) === "active";
  } catch (error) {
    return false;
  }
}

export function setSessionStatus(isActive) {
  try {
    if (isActive) {
      window.localStorage.setItem(SESSION_STATUS_KEY, "active");
    } else {
      window.localStorage.removeItem(SESSION_STATUS_KEY);
    }
  } catch (error) {
    // console.error("Could not write to localStorage", error);
  }
}
