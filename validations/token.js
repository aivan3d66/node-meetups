const Joi = require('joi')

exports.tokenValidation = (data) => {
    const schema = Joi.object({
        token_id: Joi.string().min(1).required(),
        user_id: Joi.string().min(1).required(),
    })

    return schema.validate(data)
}
