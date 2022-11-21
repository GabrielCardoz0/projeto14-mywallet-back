import express from "express";
import { putInput } from "../controllers/putInput.js";
import validaNewInput from "../midlewares/validaNewInput.js";


const NewInputRouter = express.Router()
NewInputRouter.put("/input", validaNewInput, putInput);

export default NewInputRouter;