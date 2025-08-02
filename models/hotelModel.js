import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: [true, "El nombre del hotel es obligatorio"]
    },
    logo: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    languages: [{type: String}],
    country: {
        type: String,
        required: [true, "El país es obligatorio"]
    }, city: {
        type: String,
        required: [true, "La ciudad es obligatoria"]
    }
})

export default mongoose.model('Hotel', hotelSchema);