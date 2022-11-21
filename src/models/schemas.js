import Joi from "joi";

export const newUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({tlds:{allow:false}}).required(),
    password: Joi.required()
  });

export const userSchema = Joi.object({
    email:Joi.string().email({tlds:{allow:false}}).required(),
    password: Joi.required()
  });

export const valueSchema = Joi.object({
    value:Joi.required(),
    depositType:Joi.required().valid(true,false)
});
