import hotelModel from "../models/hotelModel.js";

// Funcion para obtener todos los hoteles
export const getAllHotels = async (req, res) => {
    try {
        const hotels = await hotelModel.find();
        res.json(hotels)
    } catch(err) {
        res.status(400).json({error: err.message})
    }

}

// Funcion para obtener hoteles por ID
export const getAllHotelsById = async (req, res) => {
    try {
        const hotels = await hotelModel.findById(req.params.id);
        res.json(hotels)
    }catch(err) {
        res.status(400).json({error: err.message})
    }
}

// Funcion para agregar nuevos hoteles
export async function addHotel (req, res) {
    const {name, country, city} = req.body;
    
    if(!name || !country || !city) {
        return res.status(400).json({error: err.message})
    }

    try {
        const hotel = new hotelModel({...req.body});
        const newHotel = await hotel.save();
        res.status(201).json(newHotel);

    } catch(err) {
        res.status(400).json({error: err.message})
    }
} 


// Funcion para editar hotel existente
export const editHotel = async (req, res) => {
    // Verificar hotel_id del token de usuario
    const {hotel_id, role} = req.user;
    
    //Si sos administrador, solo podes editar el hotel que te corresponde
    if (role === 'admin') {
        if (hotel_id._id !== req.params.id) {
            return res.status(403).json({error: 'No tienes permiso para editar este hotel'});
        }
    }

    try {
        const hotelUpdated = await hotelModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(201).json(hotelUpdated) 
    }catch(err) {
        res.status(400).json({error: err.message})
    }
}

// Funcion para eliminar hotel
export const deleteHotel = async (req, res) => {
    try {
        const hotelDeleted = await hotelModel.findByIdAndDelete(req.params.id);
        res.json(hotelDeleted)
    }catch(err) {
        res.status(400).json({error: err.message})
    }
}


// Funcion para buscar hoteles por nombre - ubicación
export const searchAllHotelsByUbication = async (req, res) => {
    try {
        const {search} = req.query;
        const hotels = await hotelModel.find({
            $or: [
                { city: { $regex: search, $options: 'i' } },
                { country: { $regex: search, $options: 'i' } }
            ]
        });
        res.json(hotels)
    }catch(err) {
        res.status(400).json({error: err.message})
    }
}
