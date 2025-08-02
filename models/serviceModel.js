import mongoose, {Schema} from "mongoose";
import hotelModel from "./hotelModel.js";

const serviceSchema = new mongoose.Schema( {
    hotel_id: {
        type: Schema.Types.ObjectId, ref:'Hotel',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    availableHours: {
        type: String, 
        required: true,
    },
})

export default mongoose.model('Service', serviceSchema);