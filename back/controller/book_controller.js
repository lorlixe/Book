const { log } = require("console");
const db = require("../models");
const fs = require("fs");
const Book = db.Book;
const User = db.User;

const createdAt = new Date();
const updatedAt = new Date();

//créer un Book
exports.createBook = (req, res) => {
  const FoundUserId = req.auth.user_id;
  const BookObject = req.body;
  delete BookObject.id;
  delete BookObject.UserId;
  if (BookObject.title == null || BookObject.genre == null) {
    return res.status(400).json({ error: "un paramètre n'a pas été complété" });
  }

  User.findOne({ where: { id: FoundUserId } })
    .then((User) => {
      if (User == null) {
        return res
          .status(400)
          .json({ error: "Vous n'avez pas encore de compte" });
      }
      const newBook = Book.create({
        ...BookObject,
        UserId: FoundUserId,
        createdAt: createdAt,
        updatedAt: updatedAt,
      })
        .then(function (newBook) {
          return res.status(201).json({
            newBook,
          });
        })
        .catch((error) => res.status(500).json({ error: error }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};

// afficher les Book
module.exports.getBook = (req, res) => {
  Book.findAll()
    .then((AllBook) => {
      return res.status(200).json(AllBook);
    })
    .catch((error) => res.status(500).json({ error: error }));
};

// afficher un Book
module.exports.findBook = (req, res) => {
  Book.findOne({ where: { id: req.params.id } })
    .then((Onebook) => {
      if (Onebook == null) {
        return res.status(400).json({ error: "Ce livre n'existe pas" });
      }
      return res.status(200).json(Onebook);
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};

// Modifier un Book
exports.editBook = (req, res) => {
  const BookObject = req.body;
  delete BookObject.id;
  delete BookObject.UserId;
  Book.findOne({ where: { id: req.params.id } })
    .then((Onebook) => {
      if (Onebook == null) {
        return res.status(400).json({ error: "Ce livre n'existe pas" });
      }
      if (Onebook.UserId !== req.auth.user_id) {
        return res
          .status(400)
          .json({ error: "Vous n'êtes pas autoriser à modifier ce Livre" });
      }
      Onebook.update(BookObject, {
        updatedAt: updatedAt,
        new: true,
      });
      return res.status(200).json(Onebook);
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};

//Supprimer une Book
exports.deleteBook = (req, res) => {
  Book.findOne({ where: { id: req.params.id } })
    .then((Onebook) => {
      if (Onebook == null) {
        return res.status(400).json({ error: "Ce livre n'existe pas" });
      }
      if (Onebook.UserId !== req.auth.user_id) {
        return res
          .status(400)
          .json({ error: "Vous n'êtes pas autoriser à supprimer ce Livre" });
      }
      if (Onebook) {
        Onebook.destroy();
        return res
          .status(200)
          .json({ message: "Ce Livre a été supprimée avec succès" });
      }
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};
