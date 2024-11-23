const Joi = require('joi')
const createError = require('../utils/createError');

const registerSchema = Joi.object({
    identity: Joi
        .string()
        .required()
        .messages({ "string.empty": "username or email is required" }),

    firstName:Joi
        .string()
        .trim()
        .required()
        .messages({ "string.empty":"firstName is required" }),

    lastName:Joi
        .string()
        .trim()
        .required()
        .messages({ "string.empty":"lastName is required" }),

    password:Joi
        .string()
        .trim()
        .pattern(/^[a-zA-Z0-9]{6,}$/)
        .required()
        .messages({ 
            "string.empty":"password is required", 
            "string.pattern.base":"password must be at least 6 characters long and contain only letters and numbers" 
        }),
    
    confirmPassword:Joi
        .string()
        .trim()
        .valid(Joi.ref('password'))
        .required()
        .messages({ 
            "string.empty":"confirm password is required",
            "any.only":"confirm password must match with password"
        }),
});

const loginSchema = Joi.object({
    identity: Joi
        .string()
        .required()
        .messages({ "string.empty": "username or email is required" }),

    password:Joi
        .string()
        .trim()
        .pattern(/^[a-zA-Z0-9]{6,}$/)
        .required()
        .messages({ 
            "string.empty":"password is required", 
            "string.pattern.base":"password must be at least 6 characters long and contain only letters and numbers" 
        }),
})

const validateSchema = (schema) => (req, res, next) => {
    const {value,error} = schema.validate(req.body)
    if(error){
        return createError(400, error.details[0].message)
    }
    req.input = value
    next()
}

module.exports = {
    registerValidator: validateSchema(registerSchema),
    loginValidator: validateSchema(loginSchema)
};