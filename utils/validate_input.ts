import joi from 'joi';

/**
 * Validate user inputs
 * @param data - data
 * @returns boolean value
 */
function validate_input(data: any) {
    const schema = joi.object().keys({
        name: joi.string().required(),
        email: joi.string().required()
    });

    const { error } = schema.validate(data);
    if (error) {
        throw error;
    }

    return true;
}

export = {
    validate_input
}
