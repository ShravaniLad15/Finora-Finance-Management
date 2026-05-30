import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config";

export const errorHandler : ErrorRequestHandler = (error, req, res, next): any =>  {
  console.log("Error occured on PATH:", req.path);

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    message: "Internet Server Error",
    error: error?.message || "Unknown error occurred",
  });

}