const { User } = require("../../models");

const getUsers = async (filter) => {
    try {
        return await User.findAll(filter)
    } catch (error) {
        throw new Error(error);
    }
}

const getUser = async (filter) => {
    try {
        return await User.findOne(filter)
    } catch (error) {
        throw new Error(error);
    }
}

const createUser = async (userPayload) => {
    try {
        return await User.create(userPayload);
    } catch (error) {
        console.log(/er/, error);
        throw new Error(error);
    }
}

module.exports = { getUsers, createUser, getUser };