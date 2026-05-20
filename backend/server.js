require('dotenv').config(); 
const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// rutas
const usuariosRoutes = require("./routes/usuarios");
const diarioRoutes = require("./routes/diario");

app.use("/api/usuarios", usuariosRoutes);
app.use("/api/diario", diarioRoutes);

// prueba
app.get("/", (req, res) => {
    res.send("Servidor funcionando 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});