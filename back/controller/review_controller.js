const { log } = require("console");
const db = require("../models");
const fs = require("fs");
const Review = db.Review;
const User = db.User;
const Book = db.Book;

const createdAt = new Date();
const updatedAt = new Date();

//créer un Review
exports.createReview = async (req, res) => {
  const FoundUserId = req.auth.user_id;
  const ReviewObject = req.body;
  delete ReviewObject.id;
  delete ReviewObject.UserId;
  const foundBook = await Book.findOne({ where: { id: ReviewObject.BookId } });

  User.findOne({ where: { id: FoundUserId } })
    .then(async (User) => {
      if (User == null) {
        return res
          .status(400)
          .json({ error: "Vous n'avez pas encore de compte" });
      }
      const foundReview = await Review.findOne({
        where: { UserId: FoundUserId, BookId: ReviewObject.BookId },
      });
      if (foundReview) {
        return res.status(400).json({ error: "Vous avez déjà noter ce livre" });
      }
      if (
        ReviewObject.comment == null ||
        ReviewObject.rating == null ||
        foundBook == undefined
      ) {
        return res.status(400).json({
          error: "un paramètre n'a pas été complété ou le livre n'existe pas",
        });
      }

      if (ReviewObject.rating >= 6 || ReviewObject.rating < 0) {
        return res
          .status(400)
          .json({ error: "la note doit être comprise entre 0 et 5" });
      }
      const newReview = Review.create({
        ...ReviewObject,
        UserId: FoundUserId,
        createdAt: createdAt,
        updatedAt: updatedAt,
      })
        .then(function (newReview) {
          return res.status(201).json({
            newReview,
          });
        })
        .catch((error) => res.status(500).json({ error: error }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};

// afficher les Review
module.exports.getReview = (req, res) => {
  Review.findAll({ where: { BookId: req.params.id } })
    .then((AllReview) => {
      return res.status(200).json(AllReview);
    })
    .catch((error) => res.status(500).json({ error: error }));
};

// Modifier un Review
exports.editReview = (req, res) => {
  const ReviewObject = req.body;
  delete ReviewObject.id;
  delete ReviewObject.UserId;
  delete ReviewObject.BookId;

  Review.findOne({ where: { id: req.params.id } })
    .then((OneReview) => {
      if (OneReview == null) {
        return res.status(400).json({ error: "Cette review n'existe pas" });
      }
      log(OneReview.UserId);
      log(req.auth.user_id);

      if (OneReview.UserId !== req.auth.user_id) {
        return res
          .status(400)
          .json({ error: "Vous n'êtes pas autoriser à modifier cette review" });
      }
      OneReview.update(ReviewObject, {
        updatedAt: updatedAt,
        new: true,
      });
      return res.status(200).json(OneReview);
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};

//Supprimer une Review
exports.deleteReview = (req, res) => {
  Review.findOne({ where: { id: req.params.id } })
    .then((OneReview) => {
      if (OneReview == null) {
        return res.status(400).json({ error: "Ce livre n'existe pas" });
      }
      if (OneReview.UserId !== req.auth.user_id) {
        return res.status(400).json({
          error: "Vous n'êtes pas autoriser à supprimer ce commentaire",
        });
      }
      if (OneReview) {
        OneReview.destroy();
        return res
          .status(200)
          .json({ message: "Ce Livre a été supprimée avec succès" });
      }
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};
