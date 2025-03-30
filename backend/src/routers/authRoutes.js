// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/user", authMiddleware, (req, res) => {
  res.json({ message: "User authenticated", userId: req.user.id });
});

module.exports = router;
