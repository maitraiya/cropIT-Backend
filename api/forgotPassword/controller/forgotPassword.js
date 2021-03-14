const { user } = require('../../../schema/user');
const bcrypt = require('bcrypt');
const { validateUserForPasswordChange } = require('../../../helpers/validations');

exports.changePassword = async (req, res, next) => {

    try {
        const { error } = validateUserForPasswordChange(req.body);
        if (error) return res.status(400).send(error.message);
        const userInDatabase = await user.find({
            email: req.body.email
        })
        if (userInDatabase.length < 1)
            return res.status(400).send('User does not exists')
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(req.body.password, salt);

        const result = await user.findOneAndUpdate({
            email: req.body.email
        },
            {
                $set: {
                    password: hashedPassword
                }
            }
        );

        res.status(200).json({
            message: 'Password Succesfully Changed'
        });
    } catch (err) {
        res.status(404).json({
            error: 'Something went wrong'
        })
    }


}