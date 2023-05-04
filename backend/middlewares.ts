import jwt from "jsonwebtoken";
import env from "./environment"

export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, env.TOKEN_SECRET, (err: any, user: any) => {
    if (err)
      console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}