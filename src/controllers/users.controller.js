const userService = require("../services/user.service");
const passport = require("../utils/passport")
const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getUsers(req)
        return res.json({ users })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = { getUsers }