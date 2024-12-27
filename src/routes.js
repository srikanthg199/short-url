const express = require("express");
const app = express();
const userRoutes = require("../src/routes/user");
const shortUrlRoutes = require("../src/routes/url");
const { isAuthenticated } = require("./middlewares/authentication");

app.use("/users",
    // isAuthenticated, 
    userRoutes
);
app.use("/short-urls", shortUrlRoutes)

module.exports = app;