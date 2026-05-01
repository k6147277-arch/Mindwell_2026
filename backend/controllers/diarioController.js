const db = require("../db");

const diarioController = {
    // 1. Guardar nota y emoción (Usa tablas 'diario' y 'diario_emociones')
    crearEntrada: (req, res) => {
        const { usuario_id, contenido, fecha, emocion_id } = req.body;
        
        const sqlDiario = "INSERT INTO diario (usuario_id, contenido, fecha) VALUES (?, ?, ?)";
        
        db.query(sqlDiario, [usuario_id, contenido, fecha], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const diario_id = result.insertId;
            
            // Si el usuario eligió una emoción, la guardamos en la tabla intermedia
            if (emocion_id) {
                const sqlEmocion = "INSERT INTO diario_emociones (diario_id, emocion_id) VALUES (?, ?)";
                db.query(sqlEmocion, [diario_id, emocion_id], (errE) => {
                    if (errE) return res.status(500).json({ error: errE.message });
                    res.status(201).json({ message: "Entrada y emoción guardadas correctamente" });
                });
            } else {
                res.status(201).json({ message: "Entrada guardada (sin emoción)" });
            }
        });
    },

    // 2. Obtener historial para el calendario
    obtenerHistorial: (req, res) => {
        const { usuario_id } = req.params;
        const sql = `
            SELECT d.id, d.fecha, d.contenido, e.nombre AS emocion, e.icono 
            FROM diario d
            LEFT JOIN diario_emociones de ON d.id = de.diario_id
            LEFT JOIN emociones e ON de.emocion_id = e.id
            WHERE d.usuario_id = ?
            ORDER BY d.fecha DESC
        `;
        
        db.query(sql, [usuario_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },

    // 3. Guardar respuesta del Test Diario
    guardarTest: (req, res) => {
        const { usuario_id, pregunta, respuesta, fecha } = req.body;
        const sql = "INSERT INTO test_respuestas (usuario_id, pregunta, respuesta, fecha) VALUES (?, ?, ?, ?)";
        
        db.query(sql, [usuario_id, pregunta, respuesta, fecha], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: "Test guardado con éxito" });
        });
    },

    // 4. Obtener catálogo de emociones (Para que tus amigos llenen el select/botones)
    obtenerEmociones: (req, res) => {
        db.query("SELECT * FROM emociones", (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    }
};

module.exports = diarioController;