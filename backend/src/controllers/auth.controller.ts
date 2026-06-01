import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { Request, Response } from "express";
import { registerSchema } from "../validators/auth.validator";
import { registerService } from "../services/auth.service";


export const registerController = asyncHandler(async(req: Request, res: Response) => {
  const body = registerSchema.parse(req.body)
  await registerService(body);
  return res
    .status(HTTPSTATUS.CREATED)
    .json({ message: "User registered Successfully"});

}
);