import UserModel from "../models/user.models";
import { UnauthorizedException } from "../utils/app-error";
import { RegisterSchemaType } from "../validators/auth.validator";


export const registerService = async(body: RegisterSchemaType) => {
  const { email } = body;

  const existingUser = await UserModel.findOne({ email });
  if(existingUser) throw new UnauthorizedException("User already exists");

  const newUser = new UserModel({
    ...body,
  });

  await newUser.save();

  
};