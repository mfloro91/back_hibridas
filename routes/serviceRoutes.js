import express from "express"
import { addService, deleteService, editService, filterService, getAllServices, getAllServicesById } from "../controllers/serviceController.js";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Endpoints para servicios

//Lista los servicios filtrando el listado por hotel (de esta manera, los usuarios finales o admins solo podrán ver los servicios ofrecidos por el hotel en el cual se hospedan)
router.get('/', authenticateJWT, filterService)

// Lista de todos los servicios ofrecidos por los hoteles (solo para superadmins)
router.get('/all', authenticateJWT, authorizeRoles('superadmin'), getAllServices)

// Obtener detalle del servicio
router.get('/:id', authenticateJWT, getAllServicesById)

// Crear un nuevo servicio (solo para admins)
router.post('/', authenticateJWT, authorizeRoles('superadmin', 'admin', 'staff'), addService)

// Editar un servicio (solo para admins)
router.put('/:id', authenticateJWT, authorizeRoles('superadmin', 'admin', 'staff'), editService);

// Eliminar un servicio (solo para admins)
router.delete('/:id', authenticateJWT, authorizeRoles('superadmin', 'admin', 'staff'), deleteService);

export default router;