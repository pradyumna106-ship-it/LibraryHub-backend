export function InternalServerError(error,res) {
    console.error(error);
    return res.status(500).json({
            message: "Internal Server Error", error
    });
}

export function notFoundInDatabase(item,res) {
    console.warn(`${item} not found in Collection`);
    return res.status(404).json({
        message: `${item} not found in Collection`
    });
}

export function missingField(missingFields) {
    
  return {
                message: `Missing fields: ${missingFields.join(", ")}`
        }
}