const app = require("./src/app"); // Import the app instance
require("dotenv").config(); // Load environment variables

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
