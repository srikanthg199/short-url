require("./src/utils/passport")
require('dotenv').config();
const express = require("express");
const db = require("./models");
const app = express();
const port = process.env.PORT || 3000;
const v1Route = require("./src/routes");
const passport = require("passport");
const session = require("express-session");
const jwt = require('jsonwebtoken');
const { errorMiddleware } = require("./src/middlewares/error.middleware");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
    session({
        secret: "mySuperSecret",
        resave: true,
        saveUninitialized: false,
        cookie: { maxAge: 60000 * 60 }, // 60 minute
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));

//Base route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/public/index.html");
});

app.get("/profile", (req, res) => {
    if (req.user) {
        res.send("User successfully logged in")
    } else {
        res.redirect("/");
    }
});

// Google OAuth Routes
app.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/",
    }),
    (req, res) => {
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "12h" });
        res.json({ message: "Login successful", token });
    }
);

app.get("/hello", (req, res) => {
    console.log(/req/, req.user);
    res.json({ message: "Hello World!" });
})

//V1 Route
app.use("/api/v1/", v1Route);

app.use(errorMiddleware)

//DB Connection
db.sequelize.authenticate().then(() => {
    console.log('DB Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
