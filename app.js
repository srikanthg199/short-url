require('dotenv').config();
require("./src/utils/passport")
const express = require("express");
const db = require("./models");
const app = express();
const port = process.env.PORT || 3000;
const v1Route = require("./src/routes");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const rateLimit = require("express-rate-limit");
const { errorMiddleware } = require("./src/middlewares/error.middleware");
const { connectRedis } = require('./src/utils/redis');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(express.static("public"));

// Rate limiting configuration
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 150, // Limit each IP to 100 requests per windowMs
    message: { message: "Too many requests, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiter to all requests
app.use(limiter);

//Base route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/public/index.html");
});

// Google OAuth Routes
app.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/",
    }),
    (req, res) => {
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "12h" });
        res.json({ message: "Login successful", token });
    }
);

app.get("/hello", (req, res) => {
    res.json({ message: "Hello World!" });
})

//V1 Route
app.use("/api/v1/", v1Route);

app.use(errorMiddleware)

// Initialize app
const initializeApp = async () => {
    try {
        // Connect to Redis
        await connectRedis();
        console.log('Redis connected successfully.');

        // DB Connection
        await db.sequelize.authenticate();
        console.log('DB Connection has been established successfully.');

        // Start the Express server after Redis and DB are connected
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (err) {
        console.error('Error during initialization:', err);
        process.exit(1); // Exit the app if Redis or DB connection fails
    }
};

initializeApp();
