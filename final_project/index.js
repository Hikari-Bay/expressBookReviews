const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    const accessToken = req.session.token; // Get the token from the session

    if (!accessToken) {
        return res.status(401).json({ message: "Access token is required" });
    }

    // Verify the JWT token
    jwt.verify(accessToken, "yourSecretKey", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }

        // Attach the decoded user information to the request object
        req.user = decoded;
        next();
    });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
