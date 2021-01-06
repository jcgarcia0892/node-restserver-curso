const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} debe ser un rol válido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        // Solo permite los valores declarados en el objeto
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});
// Como no se va a devolver la contraseña ya que el usuario no necesita esa información se elimina, de esta manera la recibe la base de datos
// pero no la recibe el usuario
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
// esta libreria mongoose-unique-validators permite  validar que la propiedad de correo unique si no se cumple te arroje un mensaje, que es el segundo argumento. 
usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe ser unico'} );  

module.exports = mongoose.model('Usuario', usuarioSchema);