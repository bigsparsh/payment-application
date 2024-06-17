import jwt from "jsonwebtoken";
import express from "express";

export const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.USER_APP_SECRET as string);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
