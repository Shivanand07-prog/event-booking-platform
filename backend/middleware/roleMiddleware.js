
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Not Authenticated",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "You are not allowed to perform this action",
            });
        }

        next();
    };
};

module.exports = authorizeRoles;