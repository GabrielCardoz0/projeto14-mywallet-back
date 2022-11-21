// import Joi from "joi";
// import express from "express"

function validaNewInput(req, res, next) {
    const valueVerify = valueSchema.validate(req.body);

    if(valueVerify.error){
        const arr = valueVerify.error.details.map(d => d.message);
        return res.status(422).send(arr);
    };
    next();
};

export default validaNewInput;
