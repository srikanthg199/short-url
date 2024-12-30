const express = require("express");
const router = express.Router();
const urlController = require("../controllers/url.controller");
const { logAnalytics } = require("../middlewares/analyticsLogger");
const { isAuthenticated } = require("../middlewares/authentication");
const { createUrlSchema, getUrlByAliasSchema } = require("../validation/urlSchema");
const { validateRequest } = require("../validation/validation");

router.post("/", isAuthenticated, validateRequest(createUrlSchema), urlController.createUrl);
router.get("/:alias", logAnalytics, validateRequest(getUrlByAliasSchema), urlController.getUrlByAlias);

module.exports = router;

