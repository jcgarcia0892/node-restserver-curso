const bcrypt    = require('bcrypt');
const express   = require('express')
const app       = express();
const Usuario   = require('./../models/usuario');
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {

    let {correo, password} = req.body;

    Usuario.findOne({correo}, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: '(Usuario) o password incorrecto'
                }
            });
        };
        // la funcion compareSync de vuelve un true si la password ingresada y la encryptada hacen match, si no devuelve un false.
        if (!bcrypt.compareSync(password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'Usuario o (password) incorrecto'
                }
            });
        }

        // Generar el token ya cuando sabemos el email y la contraseña hacen match
        // el sign recibe tres argumentos el payload, la semilla, y la fecha de expiracion
        let token = jwt.sign({
            usuario: usuarioDB
            // Expira en 30 dias
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    });


});

module.exports = app;