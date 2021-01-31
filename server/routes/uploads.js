const express = require('express');
const fileUpload = require('express-fileupload');
let app = express();
const Usuario = require('./../models/usuario');
const Producto = require('./../models/producto');

const fs = require('fs');
const path = require('path');



app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposValidos = ['usuarios', 'productos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
            }
        })
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
      }
    
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', ')
            },
            extension
        })
    }

    // Cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    let uploadPath = `uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(uploadPath, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }
    
    // Imagen cargada
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);

        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });

});

function imagenProducto(id, res, nombreArchivo) {
    
    Producto.findById(id, (err, productoDB) => {

        if (err) {
            borraImagen(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borraImagen(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }
        borraImagen(productoDB.img, 'productos')
        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.status(200).json({
                ok: true,
                producto: productoGuardado
            });

            
        });


    });


}

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            // En caso de que haya un error y no se encuentre al usuario la imagen se subira de todas maneras, para evitar esto se tiene que borrar la imagen
            borraImagen(nombreArchivo, 'usuarios'); 
            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!usuarioDB) {
            borraImagen(nombreArchivo, 'usuarios'); 
            // En caso de que haya un error y no se encuentre al usuario la imagen se subira de todas maneras, para evitar esto se tiene que borrar la imagen
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        // Borrar imagen
        // Se tiene que borrar la imagen antigua de ese usuario para que no queden dos imagenes juntas
        borraImagen(usuarioDB.img, 'usuarios'); 

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });


        });

    });
}

function borraImagen(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `./../../uploads/${tipo}/${nombreImagen}`);
    console.log(path.resolve(__dirname, `./../../uploads/${tipo}/${nombreImagen}`));
    // fs.existSync regresa un true si existe la imagen o un false si no existe
    if (fs.existsSync(pathImagen)) {
    // Se usa para borrar el archivo
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;
