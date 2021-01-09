require('./config/config');
const express       = require('express')
const mongoose      = require('mongoose');
const bodyParser    = require('body-parser');
const app = express()


// usuario
// node_js

//contraseña
// WIzpYNH6BVqTTWcK


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.use(require('./routes/index.js'));

const dbConnection = async() => {
    console.log('hola',process.env.URLDB);
    try {
        await mongoose.connect(process.env.URLDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
          });
        
        console.log('Base de datos online julio');
        
    } catch (error) {
        throw new Error();
    }

};

dbConnection();

 
app.listen(process.env.PORT, () => {
    console.log('Escuchando cambios en el puerto: ', process.env.PORT);
});