const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();


// LOGIN
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const usuario = await prisma.usuarios.findUnique({
            where: {
                email
            }
        });

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: "Contraseña incorrecta"
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        res.json({
            mensaje: "Login exitoso",
            token,
            usuario
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error interno"
        });

    }

};


// REGISTER
exports.register = async (req, res) => {

    try {

        const { nombre, email, password } = req.body;

        const usuarioExiste = await prisma.usuarios.findUnique({
            where: {
                email
            }
        });

        if (usuarioExiste) {
            return res.status(400).json({
                mensaje: "El usuario ya existe"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = await prisma.usuarios.create({
            data: {
                nombre,
                email,
                password: passwordHash
            }
        });

        res.status(201).json({
            mensaje: "Usuario registrado",
            usuario: nuevoUsuario
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            error: "Error interno"
        });

    }

};