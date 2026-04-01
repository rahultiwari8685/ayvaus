export const auth = (req, res, next) => {
  req.user = { id: "USER_ID" }; // replace with JWT
  next();
};
