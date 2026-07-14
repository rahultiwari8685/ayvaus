import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    console.log("AUTH HEADER:", header);

    if (!header) {
      return res.status(401).json({ message: "No token" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    req.user = decoded;

    next();
  } catch (err) {
    console.log("AUTH ERROR:", err);

    return res.status(401).json({ message: "Invalid token" });
  }
};
