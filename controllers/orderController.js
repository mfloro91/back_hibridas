import orderModel from "../models/orderModel.js";
import hotelModel from "../models/hotelModel.js";
import serviceModel from "../models/serviceModel.js";

// Funcion para obtener todos los pedidos
export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().sort({ updatedAt: 1 }).populate('hotel_id', 'name country city').populate('service_id', 'title description availableHours').populate('user_id', 'name email');
        res.json(orders)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }

}

// Funcion para obtener pedidos por ID
export const getAllOrdersById = async (req, res) => {
    try {
        const orders = await orderModel.findById(req.params.id).populate('hotel_id', 'name country city').populate('service_id', 'title description availableHours').populate('user_id', 'name email');
        res.json(orders)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// Funcion para agregar nuevos pedidos
export async function addOrder(req, res) {
    try {
        const userHotel = req.user.hotel_id._id;
        const userId = req.user.id;
        const { service_id, note } = req.body;

        // Verificar si el servicio existe
        const service = await serviceModel.findById(service_id);
        if (!service) {
            return res.status(400).json({ error: "Servicio no encontrado" });
        }

        // Crear un nuevo pedido
        const order = new orderModel({
            hotel_id: userHotel,
            service_id,
            user_id: userId,
            note,
            status: "pendiente"
        });

        const newOrder = await order.save();
        res.status(201).json(newOrder)

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}


// Funcion solo para admins (modifican status de la orden)

export const editOrderStatus = async (req, res) => {
    const { status } = req.body;

    if (!status || !["pendiente", "en proceso", "completado"].includes(status)) {
        return res.status(400).send("El status es obligatorio y debe ser uno de los siguientes: pendiente, en proceso o completado");
    }

    try {
        const orderUpdated = await orderModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(orderUpdated)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// Funcion para eliminar pedido existente
export const deleteOrder = async (req, res) => {
    try {
        const orderDeleted = await orderModel.findByIdAndDelete(req.params.id);
        res.json(orderDeleted)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// Funcion para filtrar ordenes según:
// - Hotel 
// - Hotel + status de la orden - devuelve orden ascendente (ordenes más antigüas primero - son las de mayor urgencia)
// - Hotel + Email solicitante (puede ayudar a la facturación)
export const searchOrdersByHotel = async (req, res) => {
    try {
        //El hotel lo filtra del login - de acuerdo a qué hotel administras o en cuál te hospedas
        const userHotel = req.user.hotel_id;

        const { status, email } = req.query;

        // Si no recibe status ni email, entonces solo filtra por hotel - de hecho quiero que los admin vean las ordenes de su propio hotel por seguridad
        if (!status && !email) {
            const orders = await orderModel.find({ hotel_id: userHotel }).sort({ updatedAt: 1 }).populate('hotel_id', 'name country city').populate('service_id', 'title description availableHours').populate('user_id', 'name email');

            res.json(orders)

            // Si se ingresa el status, entonces filtraré por status pero de todas maneras quiero que los admin del hotel solo puedan filtrar las ordenes de su hotel
        } else if (!email) {

            const orders = await orderModel.find({
                $and: [
                    { status: { $regex: `^${status}$`, $options: 'i' } },
                    { hotel_id: userHotel }
                ]
            }).sort({ updatedAt: 1 }).populate('hotel_id', 'name country city').populate('service_id', 'title description availableHours').populate('user_id', 'name email');

            res.json(orders)

            // Si se ingresa el email, filtraré los pedidos por huesped y por hotel (esto puede ayudar a métricas o facturación posterior a cada cliente)
        } else if (!status) {

            const orders = await orderModel.find({
                $and: [
                    { email },
                    { hotel_id: userHotel }
                ]
            }).sort({ updatedAt: 1 }).populate('hotel_id', 'name country city').populate('service_id', 'title description availableHours').populate('user_id', 'name email');

            res.json(orders)
        }


    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}


