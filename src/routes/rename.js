import express from "express";
import signInRouter from "./signInRouter.js";
import signUpRouter from "./signUpRouter.js";
import NewInputRouter from "./newInputRouter.js";

const router = express.Router();
router.use(signInRouter);
router.use(signUpRouter);
router.use(NewInputRouter);

export default router;