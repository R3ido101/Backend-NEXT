const idValidation = {
    presence: true,
    numericality: {
        greaterThan: 0,
        strict: true
    }
};

export const VALIDATE_ID = {
    id: idValidation
};