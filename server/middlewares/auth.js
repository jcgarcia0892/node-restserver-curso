const jwt = require('jsonwebtoken')

let validarJWT = (req, res, next) => {
    // Con el get se obtiene el valor que se mandan en los headers del postman
    let  token = req.get('token');
    // el verify recibe tres argumentos, el token, la semilla y un callback con dos argumentos, el error y el payload en este caso le pusimos decoded
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};

let validarAdminRole = (req, res, next) => {
    
    let role = req.usuario.role;
    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            msg: 'No eres un usuario administrador'
        });
    }
   
    next();

}

let validarTokenImg = (req, res, next) => {

    const token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    validarJWT,
    validarAdminRole,
    validarTokenImg
}