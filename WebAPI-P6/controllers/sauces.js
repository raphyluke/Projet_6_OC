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
            const sauceObject = JSON.parse(req.body.sauce);
            delete sauceObject._id;
            const sauce = new modelsSauce({
                ...sauceObject,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
                likes: 0,
                dislikes: 0,
                usersLiked: [],
                usersDisliked: []
            });
            sauce.save()
                .then(() => res.status(201).json({
                message: 'Sauce enregistrée !'
                }))
                .catch(error => res.status(400).json({
                error
                }));
        }
    })
}

const putSauceById = (req,res) => {
    jwt.verify(req.token, process.env.BCRYPTPASSWORD, (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            let sauceObject = {};
            req.file ? (
                // Si la modification contient une image => Utilisation de l'opérateur ternaire comme structure conditionnelle.
                modelsSauce.findOne({
                _id: req.params.id
                }).then((sauce) => {
                // On supprime l'ancienne image du serveur
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlinkSync(`images/${filename}`)
                }),
                sauceObject = {
                // On modifie les données et on ajoute la nouvelle image
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${
                    req.file.filename
                }`,
                }
            ) : ( // Opérateur ternaire équivalent à if() {} else {} => condition ? Instruction si vrai : Instruction si faux
                // Si la modification ne contient pas de nouvelle image
                sauceObject = {
                ...req.body
                }
            )
            modelsSauce.updateOne(
                // On applique les paramètre de sauceObject
                {
                    _id: req.params.id
                }, {
                    ...sauceObject,
                    _id: req.params.id
                }
                )
                .then(() => res.status(200).json({
                message: 'Sauce modifiée !'
                }))
                .catch((error) => res.status(400).json({
                error
                }))
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
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id

  if (like === 1) { // Si il s'agit d'un like
    modelsSauce.updateOne({
        _id: sauceId
      }, {
        // On push l'utilisateur et on incrémente le compteur de 1
        $push: {
          usersLiked: userId
        },
        $inc: {
          likes: +1
        }, // On incrémente de 1
      })
      .then(() => res.status(200).json({
        message: 'j\'aime ajouté !'
      }))
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === -1) {
    modelsSauce.updateOne( // S'il s'agit d'un dislike
        {
          _id: sauceId
        }, {
          $push: {
            usersDisliked: userId
          },
          $inc: {
            dislikes: +1
          }, // On incrémente de 1
        }
      )
      .then(() => {
        res.status(200).json({
          message: 'Dislike ajouté !'
        })
      })
      .catch((error) => res.status(400).json({
        error
      }))
  }
  if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
    modelsSauce.findOne({
        _id: sauceId
      })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) { // Si il s'agit d'annuler un like
          modelsSauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersLiked: userId
              },
              $inc: {
                likes: -1
              }, // On incrémente de -1
            })
            .then(() => res.status(200).json({
              message: 'Like retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
        if (sauce.usersDisliked.includes(userId)) { // Si il s'agit d'annuler un dislike
          modelsSauce.updateOne({
              _id: sauceId
            }, {
              $pull: {
                usersDisliked: userId
              },
              $inc: {
                dislikes: -1
              }, // On incrémente de -1
            })
            .then(() => res.status(200).json({
              message: 'Dislike retiré !'
            }))
            .catch((error) => res.status(400).json({
              error
            }))
        }
      })
      .catch((error) => res.status(404).json({
        error
      }))
  }
        }
    })
}

module.exports = {getAllSauces, getSauceById, postSauce, putSauceById, deleteSauceById, likeSauce}