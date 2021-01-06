const bcrypt    = require('bcrypt');
const _         = require('underscore');
const express   = require('express')
const app       = express();
const Usuario   = require('./../models/usuario');

app.get('/usuario', function (req, res) {
    
    // con el query buscas los paramentos que mandan en la url por ejemplo url?desde=12
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    // Busca todos los registros si no se le coloca nada dentro de las llaves, si dentro de las llaves se coloca google: true te trae 
    // todos los usuarios que tengan google: true
    Usuario.find({estado: true}, 'nombre correo estado google role img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                // Sirve para contar la cantidad de registros como un array.length es importante que el primer argumento
                // sea igual al del find para que devuelva el mismo conteo
                Usuario.count({estado: true}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        conteo,
                        usuarios
                    });

                });

            })

  });
  
  app.post('/usuario', function (req, res) {
    let body = req.body;
    
    const usuario = new Usuario({
        nombre: body.nombre,
        correo: body.correo,
        // bcrypt sirve para encriptar la contraseña el numero 10 es por que le da 10 vueltas, se puede colocar cualquier numero
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    })
    
  });
  
  app.put('/usuario/:id', function (req, res) {
    // con el params obtienes los parametros que mandas despues de la url url/:parametro --- req.params.parametros
    let id = req.params.id;
    // _.pick() proviene de la libreria undescore el primer argumento es el objeto que se va a trabajar y lo segundo son las keys del objeto
    // que se van a filtar
    let body = _.pick(req.body, ['nombre', 'correo', 'img', 'role', 'estado']);

    // Primer argumento busqueda por id, segundo argumento la información que se va a cambiar
    // tercer argumento opciones a validar en este caso new te muestra en postman el cambio ya actualizado run validator aplica las validaciones hechas en el models
    // cuarto argumento callback con dos argumento el error y el usuario que hace match con la busqueda del id.
    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

   

        res.status(200).json({
            ok:true,
            usuario: usuarioDB
        })
    });

  });
  
//   app.delete('/usuario/:id', function (req, res) {
//     let id = req.params.id;
//     Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        
//         if (err){
//             returnres.status(400).json({
//                 ok: false,
//                 err
//             });
//         }

//         if(!usuarioBorrado) {
//             return res.status(400).json({
//                 ok: false,
//                 error: {
//                     message: 'Usuario no encontrado'
//                 }
//             })
//         }

//         res.status(200).json({
//             ok: true,
//             usuario: usuarioBorrado
//         })
//     });

//   });
  app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'correo', 'img', 'role', 'estado']);
    let estadoInhabilitado = { estado: false };
    Usuario.findByIdAndUpdate(id, estadoInhabilitado, {new: true}, (err, usuarioBorrado) => {
        
        if (err){
            returnres.status(400).json({
                ok: false,
                err
            });
        }

        if(!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })
    });

  });

  module.exports = app;