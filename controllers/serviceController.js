import serviceModel from "../models/serviceModel.js";
import hotelModel from "../models/hotelModel.js";

// Funcion para obtener todos los servicios
export const getAllServices = async (req, res) => {
    try {
        const services = await serviceModel.find().populate('hotel_id', 'name country city');
        res.json(services)
    } catch(err) {
        res.status(400).json({error: err.message})
    }

}

// Funcion para obtener servicios por ID
export const getAllServicesById = async (req, res) => {
    try {
        const services = await serviceModel.findById(req.params.id).populate('hotel_id', 'name country city');
        res.json(services)
    }catch(err) {
        res.status(400).json({error: err.message})
    }
}

// Funcion para agregar nuevos servicios
export async function addService (req, res) {
    try {
        const userHotel = req.user.hotel_id;
        const {title, description, availableHours } = req.body;

        if (!title || !availableHours) {
        return res.status(400).send('El título y los horarios del servicio son obligatorios');
        }

        const service = new serviceModel({
            hotel_id: userHotel,
            title,
            description,
            availableHours
        });

        const newService = await service.save();
        res.status(201).json(newService)
        
    } catch(err) {
        res.status(400).json({error: err.message})
    }
} 


// Funcion para editar un servicio

export const editService = async (req, res) => {
    try {
        const serviceUpdated = await serviceModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(201).json(serviceUpdated)
    }catch(err) {
        res.status(400).json({error: err.message})
    }
}

// Funcion para eliminar servicio existente
export const deleteService = async (req, res) => {
    try {
        const serviceDeleted = await serviceModel.findByIdAndDelete(req.params.id);
        res.status(201).json(serviceDeleted)
    }catch(err) {
        res.status(400).json({error: err.message})
    }
}

// Funcion para filtrar servicios por hotel en el cual te hospedas (este dato viene en el token)
export const filterService = async (req, res) => {
    try {
        const userHotel = req.user.hotel_id;
                
        const services = await serviceModel.find({ hotel_id: userHotel }).populate('hotel_id', 'name country city');
                
        res.status(201).json(services) 

    }catch(err) {
        res.status(400).json({error: err.message})
    }
}

