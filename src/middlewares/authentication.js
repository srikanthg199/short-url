const jwt = require('jsonwebtoken');

const extractToken = (headers) => {
    if (headers.authorization && headers.authorization.split(" ")[0] === "Bearer") {
        return headers.authorization.split(" ")[1];
    }
    return null;
};

exports.isAuthenticated = async (req, res, next) => {
    const jwtToken = extractToken(req.headers);
    console.log('token', jwtToken);
    if (!jwtToken) {
        return res.status(401).json({ message: "Please provide token" });
    }
    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        next();
    });
};
