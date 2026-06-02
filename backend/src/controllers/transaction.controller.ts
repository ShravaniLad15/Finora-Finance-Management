import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middleware/asyncHandler.middleware";
import { Request, Response } from "express";
import { createTransactionSchema } from "../validators/transaction.validator";
import { createTransactionService } from "../services/transaction.service";

export const createTransactionController = asyncHandler(
  async(req: Request, res: Response) => {
    const body = createTransactionSchema.parse(req.body);
    const userId = req.user?._id;
    await createTransactionService(body, userId);


    return res.status(HTTPSTATUS.CREATED).json({
      message: "Transaction created successfully",
    })
  }
)