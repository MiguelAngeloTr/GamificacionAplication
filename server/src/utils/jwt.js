import jwt from "jsonwebtoken";

export function createAccessToken(payload) {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) throw new Error("Falta TOKEN_SECRET en variables de entorno");

  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn: "1d" }, (err, token) => {
      if (err) return reject(err);
      resolve(token);
    });
  });
}
