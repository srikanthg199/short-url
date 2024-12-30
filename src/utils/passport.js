const passport = require("passport");
const { User } = require("../../models");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://short-url-8l3h.onrender.com/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const [user, created] = await User.findOrCreate({
                    where: { google_id: profile.id },
                    defaults: {
                        full_name: profile.displayName,
                        email: profile.emails[0].value,
                    },
                });
                return done(null, user);
            } catch (error) {
                console.log(/ee/, error);
                return done(error, null);
            }
        }
    )
);

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
