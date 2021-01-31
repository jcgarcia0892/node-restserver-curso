require('./config/config');
const express       = require('express')
const mongoose      = require('mongoose');
const bodyParser    = require('body-parser');
const path          = require('path');
const app = express()


// usuario
// node_js

//contraseña
// WIzpYNH6BVqTTWcK


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
// Habilitar la carpeta public clase 132
// __dirname te buscar la ruta hasta que llega a la carpeta del proyecto que en este caso es la 07-RESTSERVER
// con el path resolve el segundo argumento del path.resolve() lo que hace es concatenarse con el primero, en este caso le estamos diciendo a node
// que la pagina inicial del proyecto se encuentra en la carpeta public.
app.use(express.static(path.resolve(__dirname, './../public')));
console.log(path.resolve(__dirname, './../public'));
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