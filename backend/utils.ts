import jwt from "jsonwebtoken";
import env from "./environment"

export function generateAccessToken(username: string) {
  return jwt.sign(
    username,
    env.TOKEN_SECRET /*, { expiresIn: "10h" }*/
  );
}

