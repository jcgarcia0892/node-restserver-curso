

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

if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'ruta base de datos local';
} else {
    urlDB = 'ruta base de datos en la nube';
}

// esta es la variable global o de entorno que vamos a usar en la conexión process.env. esto es obligatorio lo que viene despues del punto lo editamos nosotros
process.env.URLDB = urlDB;