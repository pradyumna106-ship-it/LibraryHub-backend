export function validateAllFields(body) {
    const missingFields = [];

    Object.keys(body).forEach(key => {
        if (
            body[key] === null ||
            body[key] === undefined ||
            body[key] === ""
        ) {
            missingFields.push(key);
        }
    });

    return {
        isValid: missingFields.length === 0,
        missingFields
    };
}