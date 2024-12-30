const express = require("express");
const app = express();
const userRoutes = require("../src/routes/user");
const shortUrlRoutes = require("../src/routes/url");
const analyticRoutes = require("../src/routes/analytics");
const { isAuthenticated } = require("./middlewares/authentication");

app.use("/users", isAuthenticated, userRoutes);
app.use("/shorten", shortUrlRoutes);

app.use("/analytics", analyticRoutes)

module.exports = app;