const mongoose = require("mongoose")
const {Schema} = mongoose;

const utilisateurSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    }
})

const modelsUser = mongoose.model("modelsUser", utilisateurSchema)
// plugin unique validator mongoose
const uniqueValidator = require("mongoose-unique-validator")
utilisateurSchema.plugin(uniqueValidator)
module.exports = modelsUser