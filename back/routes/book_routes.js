const express = require("express");
const router = express.Router();
const { authentification } = require("../middleware/auth");

const BookCtrl = require("../controller/book_controller");

router.post("/", authentification, BookCtrl.createBook);
router.get("/", authentification, BookCtrl.getBook);
router.get("/:id", authentification, BookCtrl.findBook);
router.put("/:id", authentification, BookCtrl.editBook);
router.delete("/:id", authentification, BookCtrl.deleteBook);

module.exports = router;
