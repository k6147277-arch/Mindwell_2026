const express = require("express");
const router = express.Router();
const diarioController = require("../controllers/diarioController");

// Para las Notas Personales y Emociones (Calendario)
// Esta usa las tablas 'diario' y 'diario_emociones'
router.post("/crear", diarioController.crearEntrada);

// Para ver el historial de notas
router.get("/historial/:usuario_id", diarioController.obtenerHistorial);

// Para el Test Diario
// Esta usa la nueva tabla 'test_respuestas' que creamos
router.post("/test", diarioController.guardarTest);

// Para obtener el catálogo de emociones
// Para que el frontend muestre las caritas (😊, 😢, etc.) desde la BD
router.get("/emociones", diarioController.obtenerEmociones);

module.exports = router;