const db = require("../models");
const Book = db.Book;
const User = db.User;

// afficher des livres en fonction des préférences de l'utilisateur
module.exports.getrecommendation = (req, res) => {
  User.findOne({
    where: {
      id: req.auth.user_id,
    },
  })
    .then(async (user) => {
      const preferencesBook = await Book.findAll({
        where: {
          genre: user.preferences,
        },
      });
      console.log(preferencesBook);
      if (!preferencesBook) {
        return res
          .status(200)
          .json("Aucun livre ne correspond à votre demande");
      }
      return res.status(200).json(preferencesBook);
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};
