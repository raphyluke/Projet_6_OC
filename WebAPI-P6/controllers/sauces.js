const jwt = require("jsonwebtoken")
const modelsSauce = require("../models/modelssauce")
require('dotenv').config()

const getAllSauces = (req,res) => {
    // J'ai fini
    jwt.verify(req.token, process.env.BCRYPTPASSWORD, (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            const listsauces = modelsSauce.find()
            .then(sauces => {
                console.log(sauces)
                res.send(sauces)
            })
        }
    })
}

const getSauceById = (req,res) => {
    jwt.verify(req.token, process.env.BCRYPTPASSWORD, (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            // J'ai fini
            const sauce = modelsSauce.findById(req.params.id)
            .then(mysauce => res.send(mysauce))
        }
    })
}

const postSauce = (req,res) => {
    jwt.verify(req.token, process.env.BCRYPTPASSWORD, (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            // Gestion des images
            const sauce = new modelsSauce({
                name : req.body.sauce.name,
                manufacturer : req.body.sauce.manufacturer,
                description : req.body.sauce.description,
                mainPepper: req.body.sauce.mainPepper,
                heat : req.body.sauce.heat,
                imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`})
            sauce.save().then(() => res.status(200).json({message : "Une sauce a été créer"}))
        }
    })
}

const putSauceById = (req,res) => {
    jwt.verify(req.token, process.env.BCRYPTPASSWORD, (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            var sauce = modelsSauce.findByIdAndUpdate(req.params.id, req.body)
            .then(() => res.status(200).json({message : "Cette sauce a été mise a jour"}))
        }
    })
    // Fini
}

const deleteSauceById = (req,res) => {
    jwt.verify(req.token, process.env.BCRYPTPASSWORD, (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            // Fini
            const sauce = modelsSauce.findByIdAndDelete(req.params.id)
            .then(() => res.status(200).json({message : "Cette sauce a été supprimé"}))
        }
    })
}

const likeSauce = (req,res) => {
    jwt.verify(req.token, process.env.BCRYPTPASSWORD, (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            var sauce = modelsSauce.findById(req.params.id)
            .then(mysauce => {
                // vérification si l'utilisateur a déja liké
                var liked = false;
                mysauce.usersLiked.map(users => {
                    if (users === req.body.userId){
                        liked = true
                    }
                })
                if (liked === true) {
                    mysauce.dislikes += 1
                    mysauce.save()
                } else {
                    mysauce.likes += 1
                    mysauce.save()
                }
            })
        }
    })
}

module.exports = {getAllSauces, getSauceById, postSauce, putSauceById, deleteSauceById, likeSauce}