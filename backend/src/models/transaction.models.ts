import mongoose from "mongoose";

export enum TransactionTypeEnum{
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export interface TransactionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  type: keyof typeof TransactionTypeEnum;
  
}