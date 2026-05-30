import "dotenv/config";
import express, {NextFunction, Request, Response} from "express";
import { Env } from "./config/env.config";
import cors from "cors";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middleware/errorHandler.middleware";

const app = express();
const BASE_PATH = Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response, next: NextFunction ) => {
  throw new Error("This is test error");
  res.status(HTTPSTATUS.OK).json({
    message: "Hello SUbscribe ",
  });
}
);

app.use(errorHandler)

app.listen(Env.PORT, () => {
  console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});


