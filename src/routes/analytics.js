const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const { logAnalytics } = require("../middlewares/analyticsLogger");

router.get("/:alias", logAnalytics, analyticsController.getAnalyticsByAlias);
router.get("/topic/:topic", logAnalytics, analyticsController.getAnalyticsByTopic);

module.exports = router;

