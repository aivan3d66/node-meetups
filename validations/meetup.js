const Joi = require('joi')

const defaultRequiredString = Joi.string().min(4).max(100).required()

exports.meetupValidation = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(10).max(500).required(),
        description: Joi.string().min(100).max(3000).required(),
        tags: defaultRequiredString,
        dateTime: defaultRequiredString,
        location: defaultRequiredString,
        user_id: Joi.string().required(),
    })

    return schema.validate(data)
}
