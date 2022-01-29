const Joi= require('joi')
module.exports.vehicleSchema=Joi.object({
    vehicle: Joi.object({
        
            name:Joi.string().regex(/^[ a-zA-z]+$/).required(),
            registration:Joi.number().required(),
            category:Joi.string().valid('HMV','LMV').required()
    
    }).required()
})
