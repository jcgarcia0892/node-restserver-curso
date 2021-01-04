require('./config/config');
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.get('/usuario', function (req, res) {
  res.json('get usuario')
});

app.post('/usuario', function (req, res) {
    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            msg: 'El nombre es obligatorio'
        })
    } else {
        
        res.status(200).json({
            persona: body
        });
    }
});

app.put('/usuario/:jeje', function (req, res) {
    let id = req.params.jeje;
    res.json({
        id,
        ok: true
    })
});

app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
});
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando cambios en el puerto: ', process.env.PORT);
});