

// ================
// Puerto
// ================

process.env.PORT = process.env.PORT || 3000;

// ================
// Entorno
// ================

// esta variable sirve para saber si esta en un enviroment de produccion si no devuelve nada esp or que estamos en un ambiente de desarrollo ver 
// clase 109 curso de node, ahi como esta trabajando con dos bases de datos una local y una en la nube cuando esta en producción se va a la base de datos
// que esta en la nube y cuando se trabaja local se va a la base de datos que esta local, nosotros vamos a trabajar todo con la base de datos que esta en la nube.
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================
// Base de datos
// ================

let urlDB;

// if ( process.env.NODE_ENV === 'dev' ) {
//     urlDB = 'ruta base de datos local';
// } else {
// }
urlDB = process.env.MONGO_URI;

// ================
// Vencimiento del token
// ================

    // 60 segundos
    // 60 minutos
    // 24 horas
    // 30 dias
    process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ================
// SEED de autenticación
// ================

    process.env.SEED = process.env.SEED || 'este-es-mi-seed'

// esta es la variable global o de entorno que vamos a usar en la conexión process.env. esto es obligatorio lo que viene despues del punto lo editamos nosotros
process.env.URLDB = urlDB || 'mongodb+srv://node_js:WIzpYNH6BVqTTWcK@cluster0.zmstm.mongodb.net/nodeServer';

// A traves de heroku se pueden crear variables de entorno utilizando la consola
// heroku config     ----- ves todas las variables de entorno
// heroku config:set nombre="julio" creas una variable de entorno
// heroku config:get nombre         obtienes el valor de la variable de entorno
// heroku config:unset nombre       Eliminas la variable de entorno