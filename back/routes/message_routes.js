const express = require("express");
const router = express.Router();
const { authentification } = require("../middleware/auth");

const MessageCtrl = require("../controller/message_controller");

router.post("/", authentification, MessageCtrl.createMessage);
router.get("/", authentification, MessageCtrl.getMessage);
router.get("/:id", authentification, MessageCtrl.findMessage);
router.put("/:id", authentification, MessageCtrl.editMessage);
router.delete("/:id", authentification, MessageCtrl.deleteMessage);

module.exports = router;
