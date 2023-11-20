const express = require("express");
const router = express.Router();
const { authentification } = require("../middleware/auth");

const ReviewCtrl = require("../controller/review_controller");

router.post("/", authentification, ReviewCtrl.createReview);
router.get("/:id", authentification, ReviewCtrl.getReview);
router.put("/:id/:id", authentification, ReviewCtrl.editReview);
router.delete("/:id/:id", authentification, ReviewCtrl.deleteReview);

module.exports = router;
