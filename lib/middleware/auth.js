import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware function to verify the JWT token
export const authenticate = (handler) => {
  return async (req) => {
    // Get the user from the jwt token and add id to req object
    const token = req.headers.get('auth-token');
    if (!token) {
        return new Response(JSON.stringify({ error: "No token provided" }));
      }
    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      // Proceed to the original handler (API route)
      return handler(req);
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Invalid or expired token" }));
    }
  };
};
