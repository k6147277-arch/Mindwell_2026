const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

// Ruta para Login: http://localhost:3000/api/usuarios/login
router.post("/login", usuariosController.login);

// Ruta para Registro: http://localhost:3000/api/usuarios/register
router.post("/register", usuariosController.register);

module.exports = router;