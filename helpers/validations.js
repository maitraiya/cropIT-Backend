const Joi = require('@hapi/joi');

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().regex(/^[a-zA-Z]*$/).min(5).max(50).required().error(new Error('Name field should only consist of Alphabets with min 5 and max 50 characters.')),
        email: Joi.string().min(5).max(250).required().email().error(new Error('Please enter a valid email')),
        password: Joi.string().min(5).max(1000).required().error(new Error('Password field should have min 5 and max 1000 characters.')),
        phone: Joi.string().regex(/^[0-9]*$/).min(10).max(10).required().error(new Error('Phone field should only consist of Numeric with min and max 10 characters.')),
        address: Joi.string().min(5).max(1000).required().error(new Error('Address field should have min 5 and max 1000 characters.')),
        city: Joi.string().regex(/^[a-zA-Z]*$/).min(3).max(50).required().error(new Error('City field should only consist of Alphabets with min 3 and max 50 characters.')),
        adhaar: Joi.string().regex(/^[0-9]*$/).min(12).max(12).required().error(new Error('Adhaar field should only consist of Numeric with min and max 12 characters.'))
    });
    return schema.validate(user);
}

function validateUserForUpdation(user) {
    const schema = Joi.object({
        name: Joi.string().regex(/^[a-zA-Z]*$/).min(5).max(50).required().error(new Error('Name field should only consist of Alphabets with min 5 and max 50 characters.')),
        phone: Joi.string().regex(/^[0-9]*$/).min(10).max(10).required().error(new Error('Phone field should only consist of Numeric with min and max 10 characters.')),
        address: Joi.string().min(5).max(1000).required().error(new Error('Address field should have min 5 and max 1000 characters.')),
        city: Joi.string().regex(/^[a-zA-Z]*$/).min(3).max(50).required().error(new Error('City field should only consist of Alphabets with min 3 and max 50 characters.')),
    });
    return schema.validate(user);
}

function validateFarmer(farmer) {
    const schema = Joi.object({
        landArea: Joi.number().integer().required().error(new Error('Land Area field should only consist of Numeric.')),
        material: Joi.array().items(Joi.string().regex(/^[a-zA-Z0-9]*$/).min(5).max(250).required().error(new Error('Material field should only consist of Alphabets with min 5 and max 250 characters.'))),
    });
    return schema.validate(farmer);
}

function validateCompany(company) {
    const schema = Joi.object({
        domain: Joi.string().regex(/^[a-zA-Z]*$/).min(5).max(50).required().error(new Error('Domain field should only consist of Alphabets with min 5 and max 50 characters.')),
        material: Joi.array().items(Joi.string().regex(/^[a-zA-Z0-9]*$/).min(5).max(250).required().error(new Error('Material field should only consist of Alphabets with min 5 and max 250 characters.'))),
    });
    return schema.validate(company);
}

function validateLogin(loginDetails) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(250).required().email().error(new Error('Please enter a valid email')),
        password: Joi.string().min(5).max(1000).required().error(new Error('Password field should have min 5 and max 1000 characters.')),
    });
    return schema.validate(loginDetails);
}


module.exports.validateCompany = validateCompany;
module.exports.validateFarmer = validateFarmer;
module.exports.validateUser = validateUser;
module.exports.validateLogin = validateLogin;
module.exports.validateUserForUpdation = validateUserForUpdation;