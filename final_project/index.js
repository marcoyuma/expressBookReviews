const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const generalRoutes = require("./router/general.js");
const authRoutes = require("./router/auth_users.js");

const app = express();

app.use(bodyParser.json());

app.use(
    session({
        secret: "fingerprint_customer",
        resave: true,
        saveUninitialized: true,
    })
);

app.use("/customer", authRoutes);
app.use("/", generalRoutes);

app.listen(8000, () => {
    console.log("Server running on http://localhost:8000");
});
