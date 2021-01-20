const express = require('express');
const { validarJWT, validarAdminRole } = require('./../middlewares/auth')
let app = express();

let Categoria = require('./../models/categoria');

app.get('/categoria', validarJWT, (req, res) => {

    Categoria.find({})
    // Con el sort ordenamos por alguna propiedad de categoria, en este caso por el nombre
                .sort('nombre')
    // Con el populate podemos acceder a las propiedades de nuestro modelo que tienen una referencia hacia otro modelo
    // de esta manera traemos todo el modelo al que se hace referencia, el primer argumento es usuario ya que es el nombre de la propiedad
    // del modelo categoria y el segundo argumento son los campos que queremos que nos muestre (es opcional), en este caso solo el correo y el nombre
    // ya que el id lo muestra por defecto  
                .populate('usuario', 'nombre correo')
                .exec((err, categoria) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            msg: 'Ha ocurrido un error en su busqueda'
                        });
                    }
                    res.status(200).json({
                        ok: false,
                        categoria,
                        msg: 'Estos son los resultados'
                    })

                });


});

app.get('/categoria/:id', validarJWT, (req, res) => {
    
    let id = req.params.id;
    console.log(id);
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                msg: 'Ha ocurrido un error en su busqueda'
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe la categoria que estas buscando' 
                }
            });
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });

    })

});

app.post('/categoria', validarJWT, (req, res) => {
    // Regresa la nueva categoria
    let nombre = req.body.nombre;
    let usuario = req.usuario._id;
    console.log(nombre, usuario);

    let categoria = new Categoria({nombre, usuario});



    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        res.status(200).json({
            ok: true,
            categoria: categoriaDB,
            msg: 'Se ha creado la categoria correctamente'
        })

    });

});

app.put('/categoria/:id', (req, res) => {

// Solo se puede atualizar el nombre
    let id = req.params.id;
    console.log(id);
    let body = req.body;
    console.log(body);
    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, categoria) => {
        console.log(categoria);
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
                msg: 'No se pudo actualizar la categoria, hable con el administrador'
            });
        }

        res.status(200).json({
            ok: true,
            categoria,
            msg: 'Categoria actualizada correctamente'
        });

    });


});

app.delete('/categoria/:id', [validarJWT, validarAdminRole], (req, res) => {
// Solo un administrador puede borrar categorias
    let id = req.params.id;
    console.log(id);
    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                msg: 'Ocurrio un error hable con el administrador',
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe la categoria que estas buscando' 
                }
            });
        }

        res.status(200).json({
            ok: true,
            categoria
        });
    });
});
module.exports = app;