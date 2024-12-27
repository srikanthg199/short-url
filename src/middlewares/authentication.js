const jwt = require('jsonwebtoken');
// exports.isAuthenticated = (req, res, next) => {
//     if (!req.isAuthenticated() || !req.user) {
//         console.log(/gg/);

//         return res.status(401).json({ message: "Unauthorized" });
//     }
//     return next();
// };


exports.isAuthenticated = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        req.user = decoded;
        next();
    });
};
