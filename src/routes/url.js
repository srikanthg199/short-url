const express = require("express");
const router = express.Router();
const urlController = require("../controllers/url.controller");
const { logAnalytics } = require("../middlewares/analyticsLogger");
const { isAuthenticated } = require("../middlewares/authentication");

router.post("/", isAuthenticated, urlController.createUrl);
router.get("/:alias", logAnalytics, urlController.getUrlByAlias);

module.exports = router;

