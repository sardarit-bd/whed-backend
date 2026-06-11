import jwt from "jsonwebtoken";

const generateToken = (UserID, name, email, role, login) => {
  return jwt.sign({ UserID, name, email, role, login }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default generateToken;
