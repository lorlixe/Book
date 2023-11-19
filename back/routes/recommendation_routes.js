const express = require("express");
const router = express.Router();
const { authentification } = require("../middleware/auth");

const recommendationCtrl = require("../controller/recommendation_controller");

router.get("/", authentification, recommendationCtrl.getrecommendation);

module.exports = router;
