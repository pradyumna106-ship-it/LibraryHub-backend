export function InternalServerError(error, res) {
    console.error(error);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
}

export function notFoundInDatabase(res, item = "Resource") {
    return res.status(404).json({
        success: false,
        message: `${item} not found`
    });
}