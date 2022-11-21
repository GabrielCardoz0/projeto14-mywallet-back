import express from "express";
import { signUp } from "../controllers/authControllers.js";
import validaNewUser from "../midlewares/validaNewUser.js";

const signUpRouter = express.Router();

signUpRouter.post("/sign-up",validaNewUser, signUp);

export default signUpRouter;