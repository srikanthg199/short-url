const express = require("express");
const userController = require("../controllers/users.controller");
const router = express.Router();

router.get("/", userController.getUsers)

module.exports = router;

