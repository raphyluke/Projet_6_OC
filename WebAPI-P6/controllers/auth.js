const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const saltRounds = 10
const modelsUser = require("../models/utilisateur")

const signup = (req,res) => {
    // J'ai fini
    var email = req.body.email
    var password = req.body.password
    bcrypt.hash(password, saltRounds, function(err, hash){
        if(err) {
            console.log(err)
        };
        const user = new modelsUser({email : email, password : hash})
        user.save();
        res.status(200).json({message : "Le compte a été crée"})
    })
}

const login = (req,res) => {
    var user = modelsUser.findOne({email : req.body.email})
    .then(findeduser => {
        var email = req.body.email
        var password = req.body.password
        bcrypt.compare(password, findeduser.password, (err, result) => {
            if (result === true){
                // connexion avec JWT
                var jsontoken = jwt.sign({userId : findeduser._id}, "piiquantesaucewebapi")
                res.status(200).json({userId : findeduser._id, token : jsontoken})
            }
            else if (err) {
                console.log(err)
                // revoir ca mais sinon fini
                res.status(500).send({message : "Email ou mot de passe incorrecte"})
            }
        })
    })
}

module.exports = {signup, login}