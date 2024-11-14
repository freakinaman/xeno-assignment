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
        // Redirect to the deployed React frontend dashboard on success
        res.redirect("https://xeno-frontend-ochre.vercel.app/dashboard"); // Updated frontend URL
    }
);

// Logout Route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Error during logout:", err);
        }
        // Redirect to the deployed React frontend homepage
        res.redirect("https://xeno-frontend-ochre.vercel.app/"); // Updated frontend URL
    });
});

module.exports = router;
