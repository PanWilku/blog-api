// middleware/auth.js
import { verifyToken } from "./jwt.js"; // Fix: use verifyToken instead of verifyAccessToken

export function auth(required = true) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return required
        ? res.status(401).json({ error: "Missing Bearer token" })
        : next();
    }

    try {
      const payload = verifyToken(token); // Use verifyToken
      req.user = { id: payload.sub, email: payload.email };
      next();
    } catch {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
