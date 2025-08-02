import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET;

// Autenticacion para restringir rutas a usuarios sin logearse
export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({message: "No tienes autorización para ingresar"})
    }

    if (authHeader) {
        const token = authHeader.split(" ") [1]
       
        jwt.verify(token, secretKey, (err, payload) => {
            if (err) {
                return res.status(403).json({message: "Token inválido"})
            }
            req.user = payload;
            console.log(payload);
            next()
        })
        
    } else {
        res.sendStatus(401)
    }
}

// Restringir rutas por rol
export const authorizeRoles = (...allowedRoles) => { return (req, res, next)  => {
    
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({message: "Acceso denegado, no tenés el permiso necesario"})
    }

    next();
};
};