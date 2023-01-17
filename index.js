const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const port = 4000;

dotenv.config();
app.use(express.json());

app.get("/", (peticion, respuesta) => {
  respuesta.send("¡Hola Mundo!");
});

app.listen(port);

app.post("/api/createUser", (req, res) => {
  const username = req.body.username;
  const token = jwt.sign({ username: username }, process.env.TOKEN_SECRET, {
    expiresIn: "1800s",
  });
  res.status(201).json({ token: token });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/api/login", authenticateToken, (req, res) => {
  res.json({ msg: "Autenticado" });
});
