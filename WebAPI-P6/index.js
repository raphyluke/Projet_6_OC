const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
var bodyParser = require('body-parser')
var authRoutes = require("./routes/auth")
var saucesRoutes = require("./routes/sauces")
require('dotenv').config()

// en .env avec phrase jwt
mongoose.connect(process.env.MONGO_ADRESS)


app.use(express.json())
app.use(cors())
// route de connexion
app.use("/images", express.static("./images"))
app.use("/api/auth", authRoutes)
// route des sauces
app.use("/api/sauces", saucesRoutes)

app.listen(3000)