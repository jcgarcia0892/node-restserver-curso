const bcrypt    = require('bcrypt');
const express   = require('express')
const app       = express();
const Usuario   = require('./../models/usuario');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const usuario = require('./../models/usuario');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idtoken: token,
        audience: process.env.CLIENT_ID  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        nombre: payload.name,
        correo: payload.email,
        img: payload.picture,
        google: true
    }

}

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    console.log(req.body);
    console.log(req.query.risa);
    let googleUser;
    
    try {
        googleUser = await verify(token)
        
    } catch (error) {
        
        return res.status(403).json({
            ok: false,
            error,
            message: 'Fallo en la validacion del token'
        })
        
    }

    //                 .catch((e) => {
    //                     console.log('error catch one');
    //                 });
    // console.log(googleUser);

    Usuario.findOne({email: googleUser.correo}, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( usuarioDB ) {
            if ( usuarioDB.google === false ) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Este correo se registro por vías normales'
                    }
                });
            } else {
                
                let token = jwt.sign(
                        {usuario: usuarioDB},
                        process.env.SEED,
                        {expiresIn: process.env.CADUCIDAD_TOKEN}
                    );
                    
                    return res.status(200).json({
                        ok: true,
                        usuario: usuarioDB,
                        token
                    })
    
            }

        }else {
            // Si el usuario no existe en la base de datos.
            let usuario = new Usuario();
            usuario.nombre      = googleUser.nombre;
            usuario.correo      = googleUser.correo,
            usuario.img         = googleUser.img;
            usuario.password    = ':)';
            usuario.google      = googleUser.google;

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign(
                    {usuario: usuarioDB},
                    process.env.SEED,
                    {expiresIn: process.env.CADUCIDAD_TOKEN}
                );

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            })

        }

    });


})

module.exports = app;