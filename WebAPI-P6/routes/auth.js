const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth")

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.post("/signup", jsonParser, authController.signup)

router.post("/login", jsonParser , authController.login)

module.exports = router;