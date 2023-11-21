const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
    res.json({requestBody: req.body});
})

module.exports = router;