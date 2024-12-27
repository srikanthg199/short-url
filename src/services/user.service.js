const userRepository = require("../repositories/user.repository")
const getUsers = async (req) => {
    const users = await userRepository.getUsers()
    return users;
}

module.exports = { getUsers }