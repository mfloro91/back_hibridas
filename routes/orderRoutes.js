import express from "express"
import { addOrder, deleteOrder, editOrderStatus, getAllOrders, getAllOrdersById, searchOrdersByHotel } from "../controllers/orderController.js";
import { authenticateJWT, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Endpoints para órdenes o pedidos de los huéspedes

// Filtrar ordenes según hotel y teniendo en cuenta distintos filtros posibles: estado o habitación. Las ordena por antiguedad - primero las órdenes realizadas primeras y de mayor urgencia (solo para admins del hotel)
router.get('/', authenticateJWT, authorizeRoles('superadmin', 'admin', 'staff'), searchOrdersByHotel)

// Lista todas las solicitudes que los huespedes estan haciendo (solo superadmins tienen vista global de todos los hoteles)
router.get('/all', authenticateJWT, authorizeRoles('superadmin'), getAllOrders)

// Ver detalle de una solicitud (solo para admins)
router.get('/:id', authenticateJWT, authorizeRoles('superadmin', 'admin', 'staff'), getAllOrdersById)

// Crear una nueva solicitud 
router.post('/', authenticateJWT, authorizeRoles('user', 'superadmin'), addOrder)

// Cambiar el estado de la solicitud (solo para admin)
router.patch('/:id', authenticateJWT, authorizeRoles('superadmin', 'admin', 'staff'), editOrderStatus);

// Eliminar la solicitud - a futuro que sea un patch - no se elimina el pedido sino que se cambia el estado a cancelado (solo para admin)
router.delete('/:id', authenticateJWT, authorizeRoles('superadmin', 'admin', 'staff'), deleteOrder);

export default router;