import express from "express";
import { signIn } from "../controllers/authControllers.js";
import validaUser from "../midlewares/validaUser.js";

const signInRouter = express.Router();
signInRouter.post("/sign-in", validaUser, signIn);

export default signInRouter;