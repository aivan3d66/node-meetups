const Joi = require('joi')

exports.userValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(4).max(20).required(),
        email: Joi.string().min(6).max(40).required(),
        password: Joi.string().min(8).max(10).required(),
        roles: Joi.array()
            .items(Joi.string().required(), Joi.string())
            .required(),
    })

    return schema.validate(data)
}
