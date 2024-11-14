const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, done) => {
            // Here you can handle the user data, e.g., save it to the database
            console.log("Google Profile:", profile);
            done(null, profile);
        }
    )
);

// Serialize user data
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user data
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
