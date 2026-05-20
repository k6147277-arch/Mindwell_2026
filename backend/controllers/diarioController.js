const db = require("../db");

const diarioController = {
    // 1. Guardar entrada básica
    crearEntrada: (req, res) => {
        const { usuario_id, contenido, fecha } = req.body;
        const sql = "INSERT INTO diario (usuario_id, contenido, fecha) VALUES (?, ?, ?)";
        db.query(sql, [usuario_id, contenido, fecha], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Entrada guardada" });
        });
    },

    // 2. Obtener historial (FALTABA ESTA FUNCIÓN)
    obtenerHistorial: (req, res) => {
        const { usuario_id } = req.params;
        const sql = "SELECT * FROM diario WHERE usuario_id = ? ORDER BY fecha DESC";
        db.query(sql, [usuario_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    // 3. Guardar Test (FALTABA ESTA FUNCIÓN)
    guardarTest: (req, res) => {
        const { usuario_id, respuestas, puntaje } = req.body;
        const sql = "INSERT INTO test_respuestas (usuario_id, respuestas, puntaje) VALUES (?, ?, ?)";
        db.query(sql, [usuario_id, JSON.stringify(respuestas), puntaje], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Test guardado correctamente" });
        });
    },

    // 4. Obtener catálogo de emociones
    obtenerEmociones: (req, res) => {
        db.query("SELECT * FROM emociones", (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }
};

module.exports = diarioController;