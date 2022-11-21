import { newUserSchema } from "../models/schemas.js";
// import Joi from "joi";

function validaNewUser(req, res, next) {
    const verify = newUserSchema.validate(req.body);

    if(verify.error){
        const arr = verify.error.details.map(d => d.message);
        return res.status(422).send(arr);
    };
    next();
  };

  export default validaNewUser;
  
