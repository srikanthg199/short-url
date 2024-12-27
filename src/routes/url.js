const express = require("express");
const router = express.Router();
const urlController = require("../controllers/url.controller");
const { logAnalytics } = require("../middlewares/analyticsLogger");

router.post("/", urlController.createUrl);
router.get("/:alias", logAnalytics, urlController.getUrlByAlias);

module.exports = router;

