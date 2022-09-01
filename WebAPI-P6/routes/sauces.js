const express = require("express")
const router = express.Router()

const saucesController = require("../controllers/sauces")
const verifyToken = require("../middleware/verifyToken")

const multer = require("../middleware/multer")

router.get("/", verifyToken , saucesController.getAllSauces)

router.get("/:id", verifyToken ,saucesController.getSauceById)

router.post("/", verifyToken , multer, saucesController.postSauce)

router.put("/:id", verifyToken ,multer, saucesController.putSauceById)

router.delete("/:id", verifyToken ,saucesController.deleteSauceById)

router.post("/:id/like", verifyToken ,saucesController.likeSauce)

module.exports = router