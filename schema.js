const Joi = require('joi');
module.exports.listingScehma=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        desc: Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.string().required().min(0),
        image:Joi.string().allow("",null),

    }).required(),
})
module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        // revname:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required()
})