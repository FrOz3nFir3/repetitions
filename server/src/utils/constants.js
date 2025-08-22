export const userDetailsProjection = {
  name: 1,
  username: 1,
  email: 1,
  googleId: 1,
  studyingCount: { $size: "$studying" },
  _id: 0,
};
