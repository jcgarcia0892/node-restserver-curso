const express   = require('express');
const fs        = require('fs');
const path      = require('path');
const { validarTokenImg } = require('../middlewares/auth');


const app       = express();


app.get('/imagen/:tipo/:img', validarTokenImg, (req, res) => {

    const tipo = req.params.tipo;
    const img = req.params.img;


    let pathImagen = path.resolve(__dirname, `./../../uploads/${tipo}/${img}`);

    
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, './../assets/no-image.jpg');
    
        res.sendFile(noImagePath);
        
    }

});


module.exports = app;