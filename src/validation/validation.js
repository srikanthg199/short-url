const validateRequest = (schema) => {
    return (req, res, next) => {
        let reqData = { ...req.body };
        if (["GET", "DELETE"].includes(req.method)) {
            reqData = { ...req.params, ...req.query };
        } else if (["PUT", "PATCH", "POST"].includes(req.method)) {
            reqData = { ...req.body, ...req.params };
        }
        const { error } = schema.validate(reqData, { abortEarly: false });
        if (error) {
            return res.status(422).json({
                status: false,
                message: "Validation failed",
                errors: error.details.map((err) => err.message)[0],
            });
        }
        return next()
    }
};

module.exports = { validateRequest };
