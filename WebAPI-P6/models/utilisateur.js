const mongoose = require("mongoose")
const {Schema} = mongoose;

const utilisateurSchema = new Schema({
    email : {
        type : String,
        unique : true
    },
    password : String
})

const modelsUser = mongoose.model("modelsUser", utilisateurSchema)

module.exports = modelsUser