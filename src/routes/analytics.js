const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const { isAuthenticated } = require("../middlewares/authentication");

router.get("/overall", isAuthenticated, analyticsController.getOverallAnalytics);
router.get("/:alias", analyticsController.getAnalyticsByAlias);
router.get("/topic/:topic", analyticsController.getAnalyticsByTopic);

module.exports = router;

