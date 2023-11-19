const jwt = require("jsonwebtoken");

function authentification(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1]; // on récupère le token de la requête entrante
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // on le vérifie
    const user_id = decodedToken.user_id;
    req.auth = {
      user_id: user_id,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: "erreur d'authentification" });
  }
}

module.exports = {
  authentification,
};
