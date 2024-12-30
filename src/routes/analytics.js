const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const { isAuthenticated } = require("../middlewares/authentication");
const { validateRequest } = require("../validation/validation");
const { getAnalyticsByAliasSchema, getAnalyticsByTopicSchema } = require("../validation/analyticSchema");

router.get("/overall", isAuthenticated, analyticsController.getOverallAnalytics);
router.get("/:alias", validateRequest(getAnalyticsByAliasSchema), analyticsController.getAnalyticsByAlias);
router.get("/topic/:topic", validateRequest(getAnalyticsByTopicSchema), analyticsController.getAnalyticsByTopic);

module.exports = router;

