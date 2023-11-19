const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

//création de compte
exports.signup = (req, res, next) => {
  const ObjectUser = req.body;
  const createdAt = new Date();
  const updatedAt = new Date();
  // vérifier que la requête est complète
  if (
    ObjectUser.username == null ||
    ObjectUser.email == null ||
    ObjectUser.password == null
  ) {
    return res.status(400).json({ error: "un paramètre n'a pas été complété" });
  }

  // vérifier si l'utilisateur existe
  User.findOne({ where: { email: ObjectUser.email } })
    .then((email) => {
      console.log(email);

      if (email) {
        return res.status(400).json({ error: "L'utilisateur existe déjà" });
      }
    })
    .then(function (userFound) {
      if (!userFound) {
        bcrypt.hash(req.body.password, 10).then((hash) => {
          const newUser = User.create({
            ...ObjectUser,
            password: hash,
            createdAt: createdAt,
            updatedAt: updatedAt,
          })
            .then(function (newUser) {
              return res.status(201).json({
                user_id: newUser.id,
                name: newUser.username,
              });
            })
            .catch((error) => res.status(500).json({ error }));
        });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

//connexion utilisateur

exports.login = (req, res, next) => {
  User.findOne({
    attribute: ["email"],
    where: { email: req.body.email },
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            user_id: user.id,
            token: jwt.sign({ user_id: user.id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
