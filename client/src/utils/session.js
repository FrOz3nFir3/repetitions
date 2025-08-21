export function isSessionPotentiallyActive() {
  return document.cookie.includes("session-status=active");
}

export function clearSessionStatusCookie() {
  // To "clear" a cookie, we set its expiration date to a time in the past.
  // The path must match the one used to set the cookie.
  document.cookie =
    "session-status=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}
