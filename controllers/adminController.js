const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email !== process.env.ADMIN_ID || password !== process.env.ADMIN_KEY) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { email },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
        );

        return res.json({
            success: true,
            token
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
