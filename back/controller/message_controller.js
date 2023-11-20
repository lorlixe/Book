const { log } = require("console");
const db = require("../models");
const fs = require("fs");
const Message = db.Message;
const User = db.User;
const { Op } = require("sequelize");

const createdAt = new Date();
const updatedAt = new Date();

//créer un Message
exports.createMessage = (req, res) => {
  const FoundUserId = req.auth.user_id;
  const MessageObject = req.body;
  delete MessageObject.id;
  delete MessageObject.sender_id;
  delete MessageObject.UserId;
  if (MessageObject.content == null) {
    return res.status(400).json({ error: "un paramètre n'a pas été complété" });
  }
  User.findOne({ where: { id: MessageObject.receiver_id } }).then(
    (receiver) => {
      if (receiver == null) {
        return res.status(400).json({ error: "Ce des" });
      }
    }
  );

  User.findOne({ where: { id: FoundUserId } })
    .then((User) => {
      if (User == null) {
        return res
          .status(400)
          .json({ error: "Vous n'avez pas encore de compte" });
      }
      const newMessage = Message.create({
        ...MessageObject,
        UserId: FoundUserId,
        timestamp: createdAt,
        createdAt: createdAt,
        updatedAt: updatedAt,
      })
        .then(function (newMessage) {
          return res.status(201).json({
            newMessage,
          });
        })
        .catch((error) => res.status(500).json({ error: error }));
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};

// afficher les Messages
module.exports.getMessage = (req, res) => {
  const FoundUserId = req.auth.user_id;

  Message.findAll({
    where: {
      [Op.or]: [{ UserId: foundUserId }, { ReceiverId: foundUserId }],
    },
  })
    .then((AllMessage) => {
      return res.status(200).json(AllMessage);
    })
    .catch((error) => res.status(500).json({ error: error }));
};

// afficher un Message
module.exports.findMessage = (req, res) => {
  Message.findOne({ where: { id: req.params.id } })
    .then((OneMessage) => {
      if (OneMessage == null) {
        return res.status(400).json({ error: "Ce livre n'existe pas" });
      }
      return res.status(200).json(OneMessage);
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};

// Modifier un Message
exports.editMessage = (req, res) => {
  const MessageObject = req.body;
  delete MessageObject.id;
  delete MessageObject.UserId;
  Message.findOne({ where: { id: req.params.id } })
    .then((OneMessage) => {
      if (OneMessage == null) {
        return res.status(400).json({ error: "Ce livre n'existe pas" });
      }
      if (OneMessage.UserId !== req.auth.user_id) {
        return res
          .status(400)
          .json({ error: "Vous n'êtes pas autoriser à modifier ce Livre" });
      }
      OneMessage.update(MessageObject, {
        updatedAt: updatedAt,
        new: true,
      });
      return res.status(200).json(OneMessage);
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};

//Supprimer une Message
exports.deleteMessage = (req, res) => {
  Message.findOne({ where: { id: req.params.id } })
    .then((OneMessage) => {
      if (OneMessage == null) {
        return res.status(400).json({ error: "Ce livre n'existe pas" });
      }
      if (OneMessage.UserId !== req.auth.user_id) {
        return res
          .status(400)
          .json({ error: "Vous n'êtes pas autoriser à supprimer ce Livre" });
      }
      if (OneMessage) {
        OneMessage.destroy();
        return res
          .status(200)
          .json({ message: "Ce Livre a été supprimée avec succès" });
      }
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};
