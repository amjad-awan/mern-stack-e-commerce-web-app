import Jwt from "jsonwebtoken";

export const jwtToken = (userId) => {
  // Assuming you have generated a JWT token
console.log("userId ===", userId)
  const token = Jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn:"7d"
  });
  return token;
};

