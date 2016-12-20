const idValidation = {
    presence: true,
    numericality: {
        greaterThan: 0,
        strict: true
    }
};

const nameValidation = {
    presence: true,
    format: {
        pattern: "[a-z0-9-_]+",
        flags: "i",
        message: "can only contain letters, numbers, underscores and dashes"
    },
    length: {
        minimum: 3,
        maximum: 255,
        tooShort: 'must be at least 3 characters',
        tooLong: 'must be less than 255 characters'
    },
    uniqueRoleName: true
};

const descriptionValidation = {
    presence: true
};

export const VALIDATE_ID = {
    id: idValidation
};

export const POST = {
    name: nameValidation,
    description: descriptionValidation
};

export const PUT = {
    name: {
        ...nameValidation,
        presence: false
    },
    description: {
        ...descriptionValidation,
        presence: false
    }
};