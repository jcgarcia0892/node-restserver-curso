const express = require('express');
const Producto = require('./../models/producto');
const Categoria = require('./../models/categoria');
const { validarJWT } = require('../middlewares/auth');

let app = express();


app.get('/producto', validarJWT, (req, res) => {
    let desde = req.query.desde
    desde = (isNaN(desde))? 0 : Number(desde); 
    let limite = req.query.limite;
    limite = (isNaN(limite))? 10 : Number(limite);
    const disponibleJeje = {disponible: true}

    Producto.find(disponibleJeje)
            .skip(desde)
            .limit(limite)
            .populate('usuario', 'nombre correo')
            .populate('categoria', 'nombre')
            .sort('nombre')
            .exec((err, productos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err,
                        msg: 'Hubo un error inesperado, hable con el administrador'
                    });
                }

                res.status(200).json({
                    ok: true,
                    productos
                });

            });

});

app.get('/producto/:id', validarJWT, (req, res) => {

    const id = req.params.id;

    Producto.findById(id)
                    .populate('categoria', 'nombre')
                    .populate('usuario', 'nombre correo')
                    .exec((err, producto) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                err,
                                msg: 'Hubo un error inesperado, hable con el administrador'
                            });
                        }
                        if (!producto) {
                            return res.status(400).json({
                                ok: false,
                                err,
                                msg: 'Hubo un error inesperado, hable con el administrador'
                            });
                        }

                        res.status(200).json({
                            ok: true,
                            producto
                        });

                    });
    
});

// Buscar por nombre del producto

app.get('/producto/buscar/:termino', (req, res) => {

    let termino = req.params.termino;
    let regExp = new RegExp(termino, 'i');
    Producto.find({nombre: regExp})
            .populate('categoria', 'nombre')
            .exec((err, productosDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.status(200).json({
                    ok: true,
                    producto: productosDB
                });

            });

});

app.post('/producto', validarJWT, (req, res) => {

    const { nombre, precioUni, descripcion, disponible, categoria } = req.body;
    const usuario = req.usuario._id;

    let producto = new Producto({nombre, precioUni, descripcion, disponible, categoria, usuario});
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            productoDB,
            msg: 'Producto creado'
        });
    });


});

app.put('/producto/:id', validarJWT, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    console.log(id);
    console.log(body);
    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, producto) => {

        console.log(producto);
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!producto) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            producto,
            msg: 'El usuario ha sido actualizado'
        })
    })

});

app.delete('/producto/:id', validarJWT, (req, res) => {

    let id = req.params.id;
    let noDisponible = {disponible: false}
    Producto.findByIdAndUpdate(id, noDisponible, {new: true}, (err, producto) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!producto) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            producto
        });    
    });

});


module.exports = app;