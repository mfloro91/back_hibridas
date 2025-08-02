import express from "express"
import { getAllHotels, addHotel, getAllHotelsById, editHotel, deleteHotel, searchAllHotelsByUbication } from "../controllers/hotelController.js";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Endpoints para hoteles

// Lista todos los hoteles (solo para superadmin)
router.get('/', getAllHotels)

// Buscar hotel por ciudad (solo para superadmin)
router.get('/search', authenticateJWT, authorizeRoles('superadmin'), searchAllHotelsByUbication)

// Ver detalle de un hotel por ID (solo para superadmin)
router.get('/:id', authenticateJWT, getAllHotelsById)

// Crear info relativa a un nuevo hotel (solo para superadmins)
router.post('/', authenticateJWT, authorizeRoles('superadmin'), addHotel);

// Editar un hotel existente (los admins también pueden colaborar en la edición)
router.put('/:id', authenticateJWT, authorizeRoles('superadmin', 'admin'), editHotel);

// Elimina un hotel (solo para superadmins)
router.delete('/:id', authenticateJWT, authorizeRoles('superadmin'), deleteHotel);

export default router;