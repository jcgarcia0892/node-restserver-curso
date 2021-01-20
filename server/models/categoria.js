const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        require: [true, 'El nombre es obligatorio']

    },
    usuario: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Usuario'
    }
});


module.exports = mongoose.model('Categoria', categoriaSchema);