const express = require("express");
const passport = require("passport");

const router = express.Router();

// Route for initiating Google OAuth
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Route for handling Google OAuth callback
router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/login", // Redirect to login on failure
    }),
    (req, res) => {
        // Redirect to the React frontend dashboard on success
        res.redirect("http://localhost:3000/dashboard"); // Adjust frontend URL if deployed
    }
);

// Logout Route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error during logout:", err);
        }
        res.redirect("http://localhost:3000/"); // Redirect to React frontend homepage
    });
});

module.exports = router;
