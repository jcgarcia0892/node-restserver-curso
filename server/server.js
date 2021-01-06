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
 
app.use( require('./routes/usuarios') );

const dbConnection = async() => {

    try {
        await mongoose.connect('mongodb+srv://node_js:WIzpYNH6BVqTTWcK@cluster0.zmstm.mongodb.net/nodeServer', {
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