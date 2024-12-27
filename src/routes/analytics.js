const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const { logAnalytics } = require("../middlewares/analyticsLogger");

router.get("/overall", analyticsController.getOverallAnalytics);
router.get("/:alias", analyticsController.getAnalyticsByAlias);
router.get("/topic/:topic", analyticsController.getAnalyticsByTopic);

module.exports = router;

