const mongoose = require("mongoose")
const {Schema} = mongoose;

const modelsSauceSchema = new Schema({
    userId : String,
    name : String,
    manufacturer : String,
    description : String,
    mainPepper : String,
    imageUrl : String,
    heat : Number,
    likes : Number,
    dislikes : Number,
    usersLiked : {type: Array, required : true, default : []},
    usersDisliked : {type: Array, required : true, default : []},
})

const modelsSauce = mongoose.model("modelsSauce", modelsSauceSchema)

module.exports = modelsSauce