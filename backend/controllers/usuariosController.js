const db = require("../db");

// --- LOGIN ---
exports.login = (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM usuarios WHERE email = ? AND password = ?";

    db.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error en el servidor" });
        }

        if (results.length > 0) {
            res.json({
                message: "Login exitoso",
                user: results[0]
            });
        } else {
            res.status(401).json({
                message: "Credenciales incorrectas"
            });
        }
    });
};

// --- REGISTER ---
exports.register = (req, res) => {
    const { nombre, email, password } = req.body;

    // Validación simple
    if (!nombre || !email || !password) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const query = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";

    db.query(query, [nombre, email, password], (err, result) => {
        if (err) {
            console.error("Error al insertar:", err);
            return res.status(500).json({ message: "Error al registrar usuario" });
        }

        res.status(201).json({
            message: "Usuario registrado con éxito",
            userId: result.insertId
        });
    });
};