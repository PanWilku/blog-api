import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name?: string;
        // Add any other properties your user object might have
      };
    }
  }
}
